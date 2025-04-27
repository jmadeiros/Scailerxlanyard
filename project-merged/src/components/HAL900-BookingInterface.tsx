"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const convertTo24Hour = (time12h: string) => {
  // Extract time and AM/PM
  const timeMatch = time12h.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeMatch) {
    console.error('Invalid time format:', time12h);
    return '00:00'; // Default fallback
  }
  
  let hours = parseInt(timeMatch[1], 10);
  const minutes = timeMatch[2];
  const modifier = timeMatch[3].toUpperCase();
  
  // Convert hours based on AM/PM
  if (hours === 12) {
    hours = modifier === 'AM' ? 0 : 12;
  } else if (modifier === 'PM') {
    hours += 12;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const HAL900BookingInterface = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleMonthChange = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  const handleBooking = async () => {
    if (selectedDate && selectedTime) {
      setIsBooking(true);
      setBookingSuccess(false);
      try {
        const formData = {
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          additionalInfo: "",
          marketingConsent: false
        };

        // Show the booking form
        const bookingForm = document.createElement('div');
        bookingForm.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        bookingForm.innerHTML = `<div id="booking-form-container"></div>`;
        document.body.appendChild(bookingForm);

        // Handle form submission
        const handleSubmit = async (formData: any) => {
          try {
            const convertedTime = convertTo24Hour(selectedTime);
            console.log('Time conversion:', {
              original: selectedTime,
              converted: convertedTime
            });
            
            const response = await fetch('/api/book-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                formData,
                selectedDate,
                selectedTime: convertedTime,
              }),
            });

            const data = await response.json();
            if (!response.ok) {
              console.error('API error response:', data);
              throw new Error(data.error || 'Failed to book session');
            }

            // Remove the form
            document.body.removeChild(bookingForm);
            
            // Show success message
            setBookingSuccess(true);
            
            // Reset selection after a delay
            setTimeout(() => {
              setSelectedDate(new Date());
              setSelectedTime("");
              setBookingSuccess(false);
            }, 5000);
            
            console.log('Booking successful:', data);
          } catch (error) {
            console.error('Booking error:', error);
            alert(error instanceof Error ? error.message : 'Failed to book session');
          } finally {
            setIsBooking(false);
          }
        };

        // Render the booking form
        const BookingFormComponent = (await import('./HAL900-BookingForm')).default;
        const root = document.getElementById('booking-form-container');
        if (root) {
          const form = <BookingFormComponent 
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onClose={() => document.body.removeChild(bookingForm)}
            onSubmit={handleSubmit}
          />;
          // Use ReactDOM to render the form
          const ReactDOM = (await import('react-dom/client')).default;
          const formRoot = ReactDOM.createRoot(root);
          formRoot.render(form);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsBooking(false);
      }
    }
  };

  return (
    <section className="py-20 bg-scailer-darker">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Book a Strategy Session</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Schedule a one-on-one consultation with our scaling experts.
          </p>
        </motion.div>

        {bookingSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto bg-scailer-green/20 border border-scailer-green p-6 rounded-xl text-center mb-8"
          >
            <h3 className="text-2xl font-bold text-scailer-green mb-2">Booking Successful!</h3>
            <p className="text-white mb-4">
              Your strategy session has been scheduled. Check your calendar for details.
            </p>
          </motion.div>
        )}

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-scailer-light p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handleMonthChange(-1)}
                className="p-2 hover:bg-scailer-dark rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-medium">
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={() => handleMonthChange(1)}
                className="p-2 hover:bg-scailer-dark rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center text-white/60 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="p-2" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const isSelected =
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonth.getMonth() &&
                  selectedDate.getFullYear() === currentMonth.getFullYear();
                const isToday =
                  new Date().getDate() === day &&
                  new Date().getMonth() === currentMonth.getMonth() &&
                  new Date().getFullYear() === currentMonth.getFullYear();

                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDateClick(day)}
                    className={`p-2 rounded-lg text-center ${
                      isSelected
                        ? "bg-scailer-green text-white"
                        : isToday
                        ? "border border-scailer-green text-scailer-green"
                        : "hover:bg-scailer-dark"
                    }`}
                  >
                    {day}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Time Slots */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-scailer-light p-6 rounded-xl"
          >
            <h3 className="text-lg font-medium mb-4">Available Times</h3>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((time, index) => (
                <motion.button
                  key={time}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg flex items-center justify-center ${
                    selectedTime === time
                      ? "bg-scailer-green text-white"
                      : "bg-scailer-dark hover:bg-scailer-dark/70"
                  }`}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {time}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || isBooking}
              className={`w-full mt-6 bg-scailer-green text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                (!selectedDate || !selectedTime) && "opacity-70 cursor-not-allowed"
              }`}
            >
              {isBooking ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  <span>Book Session</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HAL900BookingInterface; 