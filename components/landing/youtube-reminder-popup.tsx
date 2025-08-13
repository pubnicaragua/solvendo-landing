"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarPlus } from "lucide-react"

interface YoutubeReminderPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function YoutubeReminderPopup({ isOpen, onClose }: YoutubeReminderPopupProps) {
  const handleAddReminder = () => {
    // Calculate tomorrow's date at 6 PM Chile time (GMT-4)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    tomorrow.setHours(18, 0, 0, 0) // Set to 6 PM

    // Adjust for Chile timezone (assuming America/Santiago, which is GMT-4 in June)
    // This is a simplified approach. For robust timezone handling, a library like `date-fns-tz` is recommended.
    // For Google Calendar, it's best to provide UTC time.
    // 6 PM Chile (GMT-4) = 10 PM UTC (22:00 UTC)
    const year = tomorrow.getFullYear()
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0")
    const day = tomorrow.getDate().toString().padStart(2, "0")
    const startHourUTC = "22" // 6 PM Chile (GMT-4) is 10 PM UTC
    const endHourUTC = "23" // Event duration 1 hour for example

    const startTime = `${year}${month}${day}T${startHourUTC}0000Z`
    const endTime = `${year}${month}${day}T${endHourUTC}0000Z`

    const eventTitle = encodeURIComponent("Lanzamiento Canal Solvendo YouTube")
    const eventDetails = encodeURIComponent("¡No te pierdas el lanzamiento del canal de YouTube de Solvendo!")
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startTime}/${endTime}&details=${eventDetails}&sf=true&output=xml`

    window.open(googleCalendarUrl, "_blank")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-blue-600">¡Lanzamiento Próximamente!</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Nuestro canal de YouTube se lanzará mañana. ¡Activa un recordatorio para no perdértelo!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleAddReminder}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <CalendarPlus className="h-5 w-5" />
            Activar Recordatorio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
