import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating 組件 (Star Rating Component)
 * 
 * 1-5 星評分元件
 * 
 * @param {Object} props - 組件 Props
 * @param {number} props.value - 當前評分 (1-5)
 * @param {Function} props.onChange - 評分變更回調
 * @param {number} [props.size=24] - 星星大小
 * @param {boolean} [props.readonly=false] - 是否唯讀
 */
export const StarRating: React.FC<{
    value: number;
    onChange: (rating: number) => void;
    size?: number;
    readonly?: boolean;
}> = ({ value, onChange, size = 24, readonly = false }) => {
    const [hoverValue, setHoverValue] = useState(0);

    const currentValue = hoverValue || value;

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
                <button
                    key={rating}
                    type="button"
                    onClick={() => !readonly && onChange(rating)}
                    onMouseEnter={() => !readonly && setHoverValue(rating)}
                    onMouseLeave={() => !readonly && setHoverValue(0)}
                    disabled={readonly}
                    className={`transition-transform ${!readonly && 'hover:scale-110 cursor-pointer'}`}
                >
                    <Star
                        size={size}
                        className={`${rating <= currentValue
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            } transition-colors`}
                    />
                </button>
            ))}
        </div>
    );
};
