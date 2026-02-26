import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'

const ChatContainer = ({selectedUser, setSelectedUser}) => {
    const scrollEnd = useRef()
    
    useEffect(() => {
        if(scrollEnd.current){
            scrollEnd.current.scrollIntoView({behavior:'smooth'})
        }
    }, [messagesDummyData])    

  return selectedUser ? (
    /* Ensure this container is strictly the height of the parent */
    <div className='h-full flex flex-col backdrop-blur-lg overflow-hidden'>

        {/* header - shrink-0 prevents it from squishing */}
        <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500 shrink-0' >
            <img src={assets.profile_martin} alt="" className='w-8 rounded-full' />
            <p className='flex-1 text-lg text-white flex items-center gap-2'>muskaan <span className='w-2 h-2 rounded-full bg-green-500'></span></p>
            <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7 cursor-pointer' />
            <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
        </div>

        {/* messages - Added min-h-0 to enable scrolling in Flexbox */}
        <div className='flex-1 overflow-y-auto p-3 min-h-0'>
            <div className='flex flex-col'>
                {messagesDummyData.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 mb-8 ${msg.senderId !== '680f50e4f10f3cd28382ecf9' ? 'flex-row-reverse justify-end' : 'justify-end'}`}>
                        {msg.image ? (
                            <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden' />
                        ) : (
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${msg.senderId === '680f50e4f10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                        )}
                        <div className='text-center text-xs'>
                            <img src={msg.senderId === '680f50e4f10f3cd28382ecf9' ? assets.avatar_icon : assets.profile_martin} alt="" className='w-7 rounded-full' />
                            <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                        </div>
                    </div>
                ))}
                <div ref={scrollEnd}></div>
            </div>
        </div>

        {/* bottom area - shrink-0 keeps it fixed at bottom */}
        <div className='flex items-center gap-3 p-3 shrink-0'>
            <div className='flex-1 flex items-center bg-gray-100/10 px-3 rounded-full'>
                <input type="text" placeholder='Send a message' className='flex-1 text-sm p-3 border-none outline-none text-white placeholder-gray-400 bg-transparent' />
                <input type="file" id='image' accept='image/png, image/jpeg' hidden />
                <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
                </label>
            </div>
            <img src={assets.send_button} alt="" className='w-7 cursor-pointer' />
        </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full'>
        <img src={assets.logo_icon} alt="" className='max-w-16' />
        <p className='text-lg font-medium text-white'> Chat anytime, anywhere </p>
    </div>
  )
}

export default ChatContainer