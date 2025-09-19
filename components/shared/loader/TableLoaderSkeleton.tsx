import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const TableLoaderSkeleton = () => {
    return (
        <div className='w-full'>
            <div className='w-full flex justify-between items-center'>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
            </div>
            <div className='w-full'>
                {
                    Array(10).fill(null).map((_, index) => (
                        <Skeleton key={index} className="w-full h-[20px] rounded-full" />
                    ))
                }
            </div>
        </div>
    );
};

export default TableLoaderSkeleton;
