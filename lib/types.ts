export type UserRole = "admin" | "student" | "company"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
  profileCompleted?: boolean
  phone?: string
  classSection?: string
  profilePicture?: string
  technologies?: string[]
  github?: string
  linkedin?: string
  position?: string
  companyId?: string // Reference to company for company employees
}

export interface Company {
  id: string
  name: string
  description: string
  logo?: string
  website?: string
  address?: string
  technologies: string[]
  specialties: string[] // Add this field
  positions: number
  users: User[]
  internshipDescription: string
  internshipPositions: number
  internshipRequirements: string
  presentationUrl?: string
  planUrl?: string
  requiresMotivationLetter: boolean
  internshipType?: "online" | "onsite" | "hybrid"
  contactPerson?: string
  contactEmail?: string
  contactPhone?: string
  createdAt: string
  updatedAt: string
}

export type PhaseType = "choose5" | "liveMeetings" | "top3Choice" | "round1" | "round2" | "round3"

export interface Phase {
  id: string
  type: PhaseType
  name: string
  description: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ApplicationStatus = "pending" | "accepted" | "rejected"

export interface Application {
  id: string
  studentId: string
  companyId: string
  phaseId: string
  priority: number
  status: ApplicationStatus
  cvUrl?: string
  motivationLetterUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Meeting {
  id: string
  companyId: string
  studentIds: string[]
  startTime: string
  endTime: string
  location: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ChatRoom {
  id: string
  companyId: string
  studentIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  chatRoomId: string
  senderId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  studentId: string
  companyId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export interface FinalReport {
  id: string
  studentId: string
  companyId: string
  reportUrl: string
  feedback?: string
  createdAt: string
  updatedAt: string
}
