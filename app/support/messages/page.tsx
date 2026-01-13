import dbConnect from "@/lib/mongodb"
import Message from "@/models/Message"
import { format } from "date-fns"

export const dynamic = "force-dynamic"

export default async function MessagesPage() {
    await dbConnect()
    await dbConnect()
    const messages = await Message.find({}).sort({ createdAt: -1 }).lean()

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Support Messages</h1>

            <div className="grid gap-4">
                {messages.length === 0 ? (
                    <div className="p-8 text-center bg-white border rounded-lg text-gray-500">
                        No messages yet.
                    </div>
                ) : (
                    messages.map((msg: any) => (
                        <div key={msg._id.toString()} className="bg-white border rounded-lg p-6 hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{msg.subject}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span className="font-medium text-black">{msg.name}</span>
                                        <span>&bull;</span>
                                        <span>{msg.email}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${msg.status === 'unread' ? 'bg-blue-100 text-blue-800' :
                                        msg.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {msg.status.toUpperCase()}
                                    </span>
                                    <p className="text-xs text-gray-400">
                                        {format(new Date(msg.createdAt), "MMM d, yyyy h:mm a")}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-700 bg-gray-50 p-4 rounded text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
