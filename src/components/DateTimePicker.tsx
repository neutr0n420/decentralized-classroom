"use client";

import * as React from "react";
import { Calendar1 } from "lucide-react"
import { format } from "date-fns";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { cn } from "../lib/utils";

interface DateTimePickerProps {
    onDateChange?: (date: Date | undefined) => void;
    initialDate?: Date;
}

export function DateTimePicker({ onDateChange, initialDate }: DateTimePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(initialDate);
    const [isOpen, setIsOpen] = React.useState(false);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        onDateChange?.(selectedDate);
    };

    const handleTimeChange = (
        type: "hour" | "minute" | "ampm",
        value: string
    ) => {
        if (date) {
            const newDate = new Date(date);
            if (type === "hour") {
                newDate.setHours(
                    (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
                );
            } else if (type === "minute") {
                newDate.setMinutes(parseInt(value));
            } else if (type === "ampm") {
                const currentHours = newDate.getHours();
                newDate.setHours(
                    value === "PM" ? currentHours + 12 : currentHours - 12
                );
            }
            setDate(newDate);
            onDateChange?.(newDate);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal bg-gray-700",
                        !date && "text-muted-foreground"
                    )}
                >
                    <Calendar1 className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "MM/dd/yyyy hh:mm aa")
                    ) : (
                        <span>MM/DD/YYYY hh:mm aa</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-700">
                <div className="sm:flex bg-gray-700">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="bg-gray-700"
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x bg-gray-700">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.reverse().map((hour) => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={
                                            date && date.getHours() % 12 === hour % 12
                                                ? "default"
                                                : "ghost"
                                        }
                                        className={cn(
                                            "sm:w-full shrink-0 aspect-square",
                                            "bg-gray-700 hover:bg-gray-600"
                                        )}
                                        onClick={() => handleTimeChange("hour", hour.toString())}
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={
                                            date && date.getMinutes() === minute
                                                ? "default"
                                                : "ghost"
                                        }
                                        className={cn(
                                            "sm:w-full shrink-0 aspect-square",
                                            "bg-gray-700 hover:bg-gray-600"
                                        )}
                                        onClick={() =>
                                            handleTimeChange("minute", minute.toString())
                                        }
                                    >
                                        {minute}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                                {["AM", "PM"].map((ampm) => (
                                    <Button
                                        key={ampm}
                                        size="icon"
                                        variant={
                                            date &&
                                                ((ampm === "AM" && date.getHours() < 12) ||
                                                    (ampm === "PM" && date.getHours() >= 12))
                                                ? "default"
                                                : "ghost"
                                        }
                                        className={cn(
                                            "sm:w-full shrink-0 aspect-square",
                                            "bg-gray-700 hover:bg-gray-600"
                                        )}
                                        onClick={() => handleTimeChange("ampm", ampm)}
                                    >
                                        {ampm}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default DateTimePicker;