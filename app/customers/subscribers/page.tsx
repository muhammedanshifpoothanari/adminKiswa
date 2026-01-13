import dbConnect from "@/lib/mongodb"
import Subscriber from "@/models/Subscriber"
import { format } from "date-fns"

export const dynamic = "force-dynamic"

export default async function SubscribersPage() {
    await dbConnect()
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 }).lean()

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Newsletter Subscribers</h1>

            <div className="bg-white rounded-lg border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-900">Email</th>
                            <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-900">Date Subscribed</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {subscribers.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    No subscribers yet.
                                </td>
                            </tr>
                        ) : (
                            subscribers.map((sub: any) => (
                                <tr key={sub._id.toString()}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.status === 'subscribed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {format(new Date(sub.createdAt), "MMM d, yyyy h:mm a")}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
