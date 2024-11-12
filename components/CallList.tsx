// @ts-nocheck
"use client"
import { useGetCalls } from '@/hooks/useGetCalls'
import { CallRecording } from '@stream-io/node-sdk'
import { Call } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import MeetingCard from './MeetingCard'
import Loader from './Loader'

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
    const { endedCalls, isLoading, recordedCalls, upcomingCalls } = useGetCalls()
    const [recordings, setRecordings] = useState<CallRecording[]>([])
    const router = useRouter()

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls
            case 'recordings':
                return recordings
            case 'upcoming':
                return upcomingCalls
            default:
                return []
        }
    }
    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'upcoming':
                return 'No Upcoming Calls';
            case 'recordings':
                return 'No Recordings';
            default:
                return '';
        }
    };


    const calls = getCalls()
    const noCallsMessage = getNoCallsMessage()
    if(isLoading ) return <Loader />

    return (
        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
            {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
                <MeetingCard
                    key={(meeting as Call).id}
                    icon={type === 'ended' ? '/icons/previous.svg' : type === 'upcoming' ? '/icons/upcoming.svg' : '/icons/recording.svg'}
                    title={(meeting as Call).state?.custom?.description.substring(0, 25) || 'No description'}
                    date={meeting.state.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
                    isPreviousMeeting={type === 'ended'}
                    buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                    buttonText={type === 'recordings' ? 'Play' : 'Start'}
                    handleClick={type === 'recordings' ? () =>
                        router.push(`/meeting/${meeting.url}`) : () =>
                        router.push(`/meeting/${meeting.id}`)
                    }
                    link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}

                />
            )) : (
                <h1 className=''>{noCallsMessage}</h1>
            )}
        </div>
    )
}

export default CallList