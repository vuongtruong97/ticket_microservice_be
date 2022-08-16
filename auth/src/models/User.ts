import { model, Schema, Model, Document } from 'mongoose'
import { Password } from '../services/password'

// an interface that describes the properties
// that are required to create a new User
interface UserAttrs {
    email: string
    password: string
}

// an interface that desc properties a User Model has
interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

// an interface that describes the properties
// that a User Document has
interface UserDoc extends Document {
    email: string
    password: string
    // createdAt: string
    // updatedAt: string
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

// pre middle ware
userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const hashed = await Password.hashedPassword(this.get('password'))
        this.set('password', hashed)
    }
})

//custom toJSON method to hide secret data
userSchema.methods.toJSON = function () {
    const user = this
    //convert mongoose document to js object
    const publicProfile = user.toObject()

    publicProfile.id = publicProfile._id

    delete publicProfile._id
    delete publicProfile.password
    delete publicProfile.__v

    return publicProfile
}

const User = model<UserDoc, UserModel>('User', userSchema)

//---------another approach ----------//
// const UserModel = model('User', userSchema)
// class User extends UserModel {
//     constructor(attrs: UserAttrs) {
//         super(attrs)
//     }
// }

export { User }
