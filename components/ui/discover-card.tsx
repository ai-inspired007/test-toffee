import React, { Children, ReactElement, ReactNode } from "react";
import classNames from 'classnames'

export interface DiscoverCardProps {
    color: string
    title: string
    subtitle: string
    buttons?: string[]
    htmlpic?: ReactNode
}

const DiscoverCard = ({ color, title, subtitle, buttons, htmlpic }: DiscoverCardProps) => {

    const cardMain = classNames(
        'w-full',
        'rounded-[15px]',
        'flex',
        'justify-between',
        'h-[330px]',
        'p-[15px]',
        'text-white'
    )

    const infoBlock = classNames(
        'flex',
        'flex-col',
        'w-[100%]'
    )

    return (
        <div className={cardMain} style={{
        backgroundColor: color 
        }} >
            <div className={infoBlock}>
                <div className="text-xl mb-[1vh]">{title}</div>
                <div className="text-sm">{subtitle}</div>
                <div className="flex relative mt-[21%]">
                    {buttons?.map((item) =>
                        <div className="ml-4">
                            <button className="bg-white rounded-[15px] p-[5px] text-black">
                                {item}
                            </button>
                        </div>
                    )}
                </div>
            </div>
                <div className="mr-[5vw] flex flex-col justify-center align-center">
                    {htmlpic}
                </div>
        </div>
    )
}

export default DiscoverCard