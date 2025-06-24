import { Q } from "@upstash/redis/zmscore-BdNsMd17";
import { Event } from "../event/event.model";
import { MeetUp } from "../meetup/meetup.model";
import { User } from "../user/user.model";
import { Donation } from "../donate/donate.model";

const allSummuryDetails = async (query:Record<string, any>) => {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalMeetups = await MeetUp.countDocuments();

    const totalDonations = await Donation.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    ])


    const data =  {
        totalUsers,
        totalEvents,
        totalMeetups,
        totalDonations : totalDonations[0]?.total || 0,
    }

  const currentYear = new Date(query.year|| new Date()).getFullYear();
  
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);
    

    const usersOfData = await User.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        },
        {
            $group: {
                _id: {
                    $month: '$createdAt'
                },
                total: { $sum: 1 }
            }
        }
    ]);


    const months = {
        1:"Jan",
        2:"Feb",
        3:"Mar",
        4:"Apr",
        5:"May",
        6:"Jun",
        7:"Jul",
        8:"Aug",
        9:"Sep",
        10:"Oct",
        11:"Nov",
        12:"Dec"
    }

    const userStatics = []

    for (let month in months) {
        const monthData = usersOfData.find(data => data._id == month);
        userStatics.push({
            month: months[month.toString() as any as  keyof typeof months],
            total: monthData ? monthData.total : 0
        })
    }

    return {
        data,
        userStatics
    }

}

export const DashboardService = {
    allSummuryDetails
}