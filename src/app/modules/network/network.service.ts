import { Move } from "../move/move.model"
import { User } from "../user/user.model"

const topReturnees = async (amount:number=10)=>{

    const users = await Move.aggregate([
        { $group: { _id: "$user", totalMoves: { $sum: 1 } } },
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $sort: { totalMoves: -1 } },
        { $limit: amount || 10 },
        { $project: { _id: "$user._id", name: "$user.name", image: "$user.image", totalMoves: 1, email: "$user.email", phone: "$user.phone" } },
    ])
    return users

}

export const NetworkService = {
    topReturnees,
}