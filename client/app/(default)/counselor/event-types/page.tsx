"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  EllipsisVertical,
  Copy,
  Trash,
  PencilLine,
  Loader2,
  Clock,
  MapPin,
  Video,
  Phone,
  CalendarClock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Empty,
  EmptyHeader,
  EmptyContent,
  EmptyTitle,
} from "@/components/ui/empty"
import { PrimaryButton } from "@/components/common/primary-button"
import { toast } from "sonner"

import sitting from "@/public/sitting.png"

import {
  getEventTypes,
  createEventType,
  updateEventType,
  deleteEventType,
  duplicateEventType,
  EVENT_TYPE_COLORS,
  DURATION_OPTIONS,
  BUFFER_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  type EventType,
  type EventTypeInput,
} from "@/lib/api/event-types"
import { getSchedules, type Schedule } from "@/lib/api/availability"

const getLocationIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />
    case "phone":
      return <Phone className="h-4 w-4" />
    default:
      return <MapPin className="h-4 w-4" />
  }
}

const getLocationLabel = (type: string) => {
  switch (type) {
    case "video":
      return "Video Call"
    case "phone":
      return "Phone Call"
    default:
      return "In Person"
  }
}

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours} hr`
  return `${hours} hr ${mins} min`
}

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false)
  const [isDialogLoading, setIsDialogLoading] = useState(false)

  // Selected event type for edit/delete/duplicate
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(
    null
  )

  // Form state
  const [formData, setFormData] = useState<EventTypeInput>({
    name: "",
    description: "",
    duration: 30,
    color: "#991b1b",
    category: "counseling",
    locationType: "in_person",
    locationDetails: "",
    isActive: true,
    requiresApproval: false,
    maxBookingsPerDay: null,
    bufferBefore: 0,
    bufferAfter: 0,
    scheduleId: null,
  })

  // Duplicate name
  const [duplicateName, setDuplicateName] = useState("")

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [loadedEventTypes, loadedSchedules] = await Promise.all([
          getEventTypes(),
          getSchedules(),
        ])
        setEventTypes(loadedEventTypes)
        setSchedules(loadedSchedules)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast.error("Failed to load event types")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: 30,
      color: "#991b1b",
      category: "counseling",
      locationType: "in_person",
      locationDetails: "",
      isActive: true,
      requiresApproval: false,
      maxBookingsPerDay: null,
      bufferBefore: 0,
      bufferAfter: 0,
      scheduleId: schedules.find((s) => s.isDefault)?.id || null,
    })
  }

  // Open create dialog
  const openCreateDialog = () => {
    resetForm()
    setCreateDialogOpen(true)
  }

  // Open edit dialog
  const openEditDialog = (eventType: EventType) => {
    setSelectedEventType(eventType)
    setFormData({
      name: eventType.name,
      description: eventType.description || "",
      duration: eventType.duration,
      color: eventType.color,
      category: eventType.category,
      locationType: eventType.locationType,
      locationDetails: eventType.locationDetails || "",
      isActive: eventType.isActive,
      requiresApproval: eventType.requiresApproval,
      maxBookingsPerDay: eventType.maxBookingsPerDay,
      bufferBefore: eventType.bufferBefore,
      bufferAfter: eventType.bufferAfter,
      scheduleId: eventType.scheduleId,
    })
    setEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (eventType: EventType) => {
    setSelectedEventType(eventType)
    setDeleteDialogOpen(true)
  }

  // Open duplicate dialog
  const openDuplicateDialog = (eventType: EventType) => {
    setSelectedEventType(eventType)
    setDuplicateName(`${eventType.name} (copy)`)
    setDuplicateDialogOpen(true)
  }

  // Handle create
  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter an event type name")
      return
    }

    setIsDialogLoading(true)
    const result = await createEventType(formData)
    setIsDialogLoading(false)

    if (result.success && result.eventType) {
      setEventTypes((prev) => [...prev, result.eventType!])
      setCreateDialogOpen(false)
      toast.success("Event type created successfully")
    } else {
      toast.error(result.error || "Failed to create event type")
    }
  }

  // Handle update
  const handleUpdate = async () => {
    if (!selectedEventType || !formData.name.trim()) {
      toast.error("Please enter an event type name")
      return
    }

    setIsDialogLoading(true)
    const result = await updateEventType(selectedEventType.id, formData)
    setIsDialogLoading(false)

    if (result.success && result.eventType) {
      setEventTypes((prev) =>
        prev.map((et) =>
          et.id === selectedEventType.id ? result.eventType! : et
        )
      )
      setEditDialogOpen(false)
      toast.success("Event type updated successfully")
    } else {
      toast.error(result.error || "Failed to update event type")
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedEventType) return

    setIsDialogLoading(true)
    const result = await deleteEventType(selectedEventType.id)
    setIsDialogLoading(false)

    if (result.success) {
      setEventTypes((prev) =>
        prev.filter((et) => et.id !== selectedEventType.id)
      )
      setDeleteDialogOpen(false)
      toast.success("Event type deleted successfully")
    } else {
      toast.error(result.error || "Failed to delete event type")
    }
  }

  // Handle duplicate
  const handleDuplicate = async () => {
    if (!selectedEventType || !duplicateName.trim()) {
      toast.error("Please enter a name for the duplicate")
      return
    }

    setIsDialogLoading(true)
    const result = await duplicateEventType(selectedEventType.id, duplicateName)
    setIsDialogLoading(false)

    if (result.success && result.eventType) {
      setEventTypes((prev) => [...prev, result.eventType!])
      setDuplicateDialogOpen(false)
      toast.success("Event type duplicated successfully")
    } else {
      toast.error(result.error || "Failed to duplicate event type")
    }
  }

  // Toggle active status
  const handleToggleActive = useCallback(async (eventType: EventType) => {
    const result = await updateEventType(eventType.id, {
      isActive: !eventType.isActive,
    })

    if (result.success && result.eventType) {
      setEventTypes((prev) =>
        prev.map((et) => (et.id === eventType.id ? result.eventType! : et))
      )
      toast.success(
        result.eventType.isActive
          ? "Event type activated"
          : "Event type deactivated"
      )
    } else {
      toast.error(result.error || "Failed to update event type")
    }
  }, [])

  return (
    <main id="main-container" className="mt-12 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-wide">
              Event Types
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your appointment types for student bookings
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide"
          >
            New Event Type
          </Button>
        </div>

        {isLoading ? (
          <Skeleton className="h-[510px] w-full rounded-md" />
        ) : eventTypes.length === 0 ? (
          <Empty className="rounded-sm border-1 !pb-0">
            <EmptyHeader>
              <EmptyTitle className="mt-6 text-3xl font-semibold tracking-wide">
                No event types yet
              </EmptyTitle>
            </EmptyHeader>
            <EmptyContent className="text-regular text-md text-main4 gap-8 tracking-wide">
              <div>
                Create your first event type to start accepting appointments
                from students. <br />
                Define the type, duration, and settings for your counseling
                sessions.
              </div>

              <PrimaryButton
                content="Create Event Type"
                onClick={openCreateDialog}
              />
            </EmptyContent>
            <div className="">
              <Image
                src={sitting}
                alt="Sitting Siklab"
                className="relative top-7 h-auto w-50"
              />
            </div>
          </Empty>
        ) : (
          <div className="space-y-2">
            {eventTypes.map((eventType) => (
              <Card
                key={eventType.id}
                className={`relative overflow-hidden py-0 transition-shadow hover:shadow-md ${
                  !eventType.isActive ? "opacity-60" : ""
                }`}
              >
                {/* Color bar */}
                <div
                  className="absolute top-0 left-0 h-full w-1"
                  style={{ backgroundColor: eventType.color }}
                />

                <CardContent className="px-4 py-3 pl-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Main Content */}
                    <div className="min-w-0 flex-1">
                      {/* Name + Category Row */}
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">
                          {eventType.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="h-5 px-1.5 text-xs capitalize"
                        >
                          {eventType.category === "exit"
                            ? "Exit Interview"
                            : eventType.category}
                        </Badge>
                        {!eventType.isActive && (
                          <Badge
                            variant="secondary"
                            className="h-5 px-1.5 text-xs"
                          >
                            Inactive
                          </Badge>
                        )}
                      </div>

                      {/* Details Row */}
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatDuration(eventType.duration)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {getLocationIcon(eventType.locationType)}
                          <span>
                            {getLocationLabel(eventType.locationType)}
                          </span>
                        </div>

                        {eventType.scheduleName && (
                          <div className="flex items-center gap-1">
                            <CalendarClock className="h-3.5 w-3.5" />
                            <span>{eventType.scheduleName}</span>
                          </div>
                        )}

                        {eventType.requiresApproval && (
                          <Badge
                            variant="outline"
                            className="h-5 px-1.5 text-xs"
                          >
                            Requires approval
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={eventType.isActive}
                        onCheckedChange={() => handleToggleActive(eventType)}
                        className="data-[state=checked]:bg-main cursor-pointer"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 cursor-pointer"
                          >
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => openEditDialog(eventType)}
                          >
                            <PencilLine className="text-muted-foreground mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => openDuplicateDialog(eventType)}
                          >
                            <Copy className="text-muted-foreground mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <Separator />
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => openDeleteDialog(eventType)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="h-20"></div>
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Event Type</DialogTitle>
            <DialogDescription>
              Set up a new appointment type for students to book
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Academic Counseling"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this appointment type"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={formData.category || "counseling"}
                onValueChange={(
                  value:
                    | "interview"
                    | "counseling"
                    | "assessment"
                    | "exit"
                    | "custom"
                ) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-muted-foreground text-xs">
                          {option.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Category determines which step in the student journey this event
                type appears
              </p>
            </div>

            {/* Duration and Color */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Duration</Label>
                <Select
                  value={String(formData.duration)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, duration: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) =>
                    setFormData({ ...formData, color: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: formData.color }}
                        />
                        {EVENT_TYPE_COLORS.find(
                          (c) => c.value === formData.color
                        )?.name || "Custom"}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPE_COLORS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Type */}
            <div className="grid gap-2">
              <Label>Location</Label>
              <Select
                value={formData.locationType}
                onValueChange={(value: "in_person" | "video" | "phone") =>
                  setFormData({ ...formData, locationType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Details */}
            <div className="grid gap-2">
              <Label htmlFor="locationDetails">Location Details</Label>
              <Input
                id="locationDetails"
                placeholder={
                  formData.locationType === "in_person"
                    ? "e.g., Room 201, Admin Building"
                    : formData.locationType === "video"
                      ? "e.g., Zoom link will be sent"
                      : "e.g., I will call the provided number"
                }
                value={formData.locationDetails || ""}
                onChange={(e) =>
                  setFormData({ ...formData, locationDetails: e.target.value })
                }
              />
            </div>

            {/* Schedule */}
            <div className="grid gap-2">
              <Label>Availability Schedule</Label>
              <Select
                value={formData.scheduleId || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    scheduleId: value === "none" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Use default schedule</SelectItem>
                  {schedules.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.name}
                      {schedule.isDefault && " (default)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Buffer Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Buffer Before</Label>
                <Select
                  value={String(formData.bufferBefore)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bufferBefore: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUFFER_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Buffer After</Label>
                <Select
                  value={String(formData.bufferAfter)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bufferAfter: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUFFER_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Max Bookings */}
            <div className="grid gap-2">
              <Label htmlFor="maxBookings">Max Bookings Per Day</Label>
              <Input
                id="maxBookings"
                type="number"
                min="1"
                placeholder="Leave empty for unlimited"
                value={formData.maxBookingsPerDay || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxBookingsPerDay: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>

            {/* Requires Approval */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium">Requires Approval</Label>
                <p className="text-muted-foreground text-sm">
                  Manually approve each booking request
                </p>
              </div>
              <Switch
                checked={formData.requiresApproval}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, requiresApproval: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isDialogLoading || !formData.name.trim()}
              className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide"
            >
              {isDialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event Type"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Same form as Create */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Event Type</DialogTitle>
            <DialogDescription>
              Update the settings for this appointment type
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Academic Counseling"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description of this appointment type"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={formData.category || "counseling"}
                onValueChange={(
                  value:
                    | "interview"
                    | "counseling"
                    | "assessment"
                    | "exit"
                    | "custom"
                ) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-muted-foreground text-xs">
                          {option.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Category determines which step in the student journey this event
                type appears
              </p>
            </div>

            {/* Duration and Color */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Duration</Label>
                <Select
                  value={String(formData.duration)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, duration: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) =>
                    setFormData({ ...formData, color: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: formData.color }}
                        />
                        {EVENT_TYPE_COLORS.find(
                          (c) => c.value === formData.color
                        )?.name || "Custom"}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPE_COLORS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Type */}
            <div className="grid gap-2">
              <Label>Location</Label>
              <Select
                value={formData.locationType}
                onValueChange={(value: "in_person" | "video" | "phone") =>
                  setFormData({ ...formData, locationType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Details */}
            <div className="grid gap-2">
              <Label htmlFor="edit-locationDetails">Location Details</Label>
              <Input
                id="edit-locationDetails"
                placeholder={
                  formData.locationType === "in_person"
                    ? "e.g., Room 201, Admin Building"
                    : formData.locationType === "video"
                      ? "e.g., Zoom link will be sent"
                      : "e.g., I will call the provided number"
                }
                value={formData.locationDetails || ""}
                onChange={(e) =>
                  setFormData({ ...formData, locationDetails: e.target.value })
                }
              />
            </div>

            {/* Schedule */}
            <div className="grid gap-2">
              <Label>Availability Schedule</Label>
              <Select
                value={formData.scheduleId || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    scheduleId: value === "none" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Use default schedule</SelectItem>
                  {schedules.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.name}
                      {schedule.isDefault && " (default)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Buffer Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Buffer Before</Label>
                <Select
                  value={String(formData.bufferBefore)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bufferBefore: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUFFER_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Buffer After</Label>
                <Select
                  value={String(formData.bufferAfter)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bufferAfter: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUFFER_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Max Bookings */}
            <div className="grid gap-2">
              <Label htmlFor="edit-maxBookings">Max Bookings Per Day</Label>
              <Input
                id="edit-maxBookings"
                type="number"
                min="1"
                placeholder="Leave empty for unlimited"
                value={formData.maxBookingsPerDay || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxBookingsPerDay: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>

            {/* Requires Approval */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium">Requires Approval</Label>
                <p className="text-muted-foreground text-sm">
                  Manually approve each booking request
                </p>
              </div>
              <Switch
                checked={formData.requiresApproval}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, requiresApproval: checked })
                }
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium">Active</Label>
                <p className="text-muted-foreground text-sm">
                  Only active event types are visible to students
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isDialogLoading || !formData.name.trim()}
              className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide"
            >
              {isDialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedEventType?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDialogLoading}
            >
              {isDialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Event Type"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Dialog */}
      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Event Type</DialogTitle>
            <DialogDescription>
              Create a copy of &quot;{selectedEventType?.name}&quot; with all
              its settings. The duplicate will be inactive by default.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="duplicate-name">New Name</Label>
              <Input
                id="duplicate-name"
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDuplicate()
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDuplicateDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDuplicate}
              disabled={isDialogLoading || !duplicateName.trim()}
              className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide"
            >
              {isDialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Duplicating...
                </>
              ) : (
                "Duplicate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
