import * as z from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(2, "Message must be at least 2 characters"),
})

export const studentIndividualDataSchema = z
  .object({
    idNo: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{4}$/, "Format must be YYYY-NNNN")
      .refine(
        (val) => {
          const year = parseInt(val.slice(0, 4), 10)
          const currentYear = new Date().getFullYear()
          return year >= 2015 && year <= currentYear
        },
        { message: "Year must be between 2015 and current year" }
      ),

    course: z
      .string()
      .trim()
      .min(2, "Course must be valid")
      .max(100, "Course must be at most 100 characters"),

    saseScore: z.coerce
      .number<number>("SASE Score must be a number")
      .min(0, "SASE Score must be at least 0")
      .max(200, "SASE Score must be at most 200"),

    academicYear: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY")
      .refine(
        (val) => {
          const [start, end] = val.split("-").map(Number)
          const currentYear = new Date().getFullYear()
          return start === currentYear && end === currentYear + 1
        },
        {
          message:
            "Academic year must be the current and next year (e.g. 2025-2026)",
        }
      ),

    familyName: z
      .string("Family name must be valid")
      .trim()
      .min(2, "Family name must be at least 2 characters")
      .max(50, "Family name must be at most 50 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Family name must contain only letters, spaces, hyphens, and apostrophes"
      ),

    givenName: z
      .string("Given name must be valid")
      .trim()
      .min(2, "Given name must be at least 2 characters")
      .max(50, "Given name must be at most 50 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Given name must contain only letters, spaces, hyphens, and apostrophes"
      ),

    middleInitial: z
      .string("Middle initial must be valid")
      .trim()
      .regex(
        /^[a-zA-Z]?$/,
        "Middle initial must contain only one letter or be left blank"
      )
      .optional(),

    studentStatus: z.enum(["New", "Transferee", "Returnee", "Shiftee"]),

    nickname: z
      .string()
      .trim()
      .min(1, "Nickname must be at least 1 character")
      .max(30, "Nickname must be at most 30 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Nickname must contain only letters, spaces, hyphens, and apostrophes"
      ),

    age: z.coerce
      .number<number>("Age must be valid")
      .min(0, "Age cannot be negative")
      .max(40, "Age must be at most 40"),

    sex: z.enum(["Male", "Female"]),

    citizenship: z
      .string()
      .trim()
      .min(2, "Citizenship must be at least 2 characters")
      .max(50, "Citizenship must be at most 50 characters")
      .regex(
        /^[a-zA-Z\s-]+$/,
        "Citizenship must contain only letters, spaces, and hyphens"
      ),

    dateOfBirth: z
      .string()
      .trim()
      .regex(
        /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
        "Format must be MM-DD-YYYY"
      )
      .refine(
        (val) => {
          const year = parseInt(val.slice(6, 10), 10)
          const currentYear = new Date().getFullYear()
          return year <= currentYear
        },
        { message: "Date of birth cannot be in the future" }
      ),

    placeOfBirth: z
      .string()
      .trim()
      .min(2, "Place of birth must be at least 2 characters")
      .max(50, "Place of birth must be at most 50 characters"),

    religiousAffiliation: z
      .string()
      .trim()
      .min(2, "Religious affiliation must be at least 2 characters")
      .max(50, "Religious affiliation must be at most 50 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Must contain only letters, spaces, hyphens, and apostrophes"
      ),

    civilStatus: z.enum([
      "Single",
      "Married",
      "Not legally married",
      "Separated",
      "Widowed",
      "Others",
    ]),

    otherCivilStatus: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          return /^[a-zA-Z\s'-]+$/.test(val)
        },
        {
          message:
            "Civil status must contain only letters, spaces, hyphens, and apostrophes",
        }
      ),

    noOfChildren: z.coerce
      .number<number>("Number of children must be valid")
      .min(0, "Number of children cannot be negative"),

    addressInIligan: z
      .string()
      .trim()
      .min(2, "Address in Iligan must be at least 2 characters")
      .max(100, "Address in Iligan must be at most 100 characters"),

    contactNo: z
      .string()
      .trim()
      .refine(
        (val) => val === "N/A" || /^\d{11}$/.test(val),
        "Contact number must be 11 digits or 'N/A'"
      ),

    homeAddress: z
      .string()
      .trim()
      .min(2, "Home address must be at least 2 characters")
      .max(100, "Home address must be at most 100 characters"),

    staysWith: z.enum([
      "Parents/Guardians",
      "Board/Room mates",
      "Relatives",
      "Friends",
      "Employer",
      "Living on my own",
    ]),

    workingStudent: z.enum([
      "Yes, full time",
      "Yes, part time",
      "No, but planning to work",
      "No, and have no plan to work",
    ]),

    talentsAndSkills: z
      .string()
      .trim()
      .min(2, "Talents and skills must be at least 2 characters")
      .max(400, "Talents and skills must be at most 400 characters"),

    leisureAndRecreationalActivities: z
      .string()
      .trim()
      .min(
        2,
        "Leisure and recreational activities must be at least 2 characters"
      )
      .max(
        400,
        "Leisure and recreational activities must be at most 400 characters"
      ),

    seriousMedicalCondition: z.enum(["None", "Existing"]).optional(),

    otherSeriousMedicalCondition: z.string().trim().optional(),

    physicalDisability: z.enum(["None", "Existing"]).optional(),

    otherPhysicalDisability: z.string().trim().optional(),

    genderIdentity: z.enum([
      "Male/Man",
      "Female/Woman",
      "Transgender Male/Man",
      "Transgender Female/Woman",
      "Gender Variant/Nonconforming",
      "Not listed",
      "Prefer not to answer",
    ]),

    sexualAttraction: z.enum([
      "My same gender",
      "Opposite my gender",
      "Both men and women",
      "All genders",
      "Neither gender",
      "Prefer not to answer",
    ]),
  })
  .refine(
    (data) =>
      data.civilStatus !== "Others" ||
      (data.otherCivilStatus && data.otherCivilStatus.trim().length >= 2),
    {
      message: "Please specify your civil status",
      path: ["otherCivilStatus"],
    }
  )
  .refine(
    (data) =>
      data.seriousMedicalCondition !== "Existing" ||
      !!data.otherSeriousMedicalCondition?.trim(),
    {
      message: "Please specify your medical condition",
      path: ["otherSeriousMedicalCondition"],
    }
  )
  .refine(
    (data) =>
      data.physicalDisability !== "Existing" ||
      !!data.otherPhysicalDisability?.trim(),
    {
      message: "Please specify your physical disability",
      path: ["otherPhysicalDisability"],
    }
  )

export const familyDataSchema = z.object({
  fathersName: z
    .string()
    .trim()
    .min(2, "Father's name must be at least 2 characters or N/A")
    .max(50, "Father's name must be at most 50 characters or N/A")
    .regex(
      /^[a-zA-Z\s'-/]+$/,
      "Father's name must contain only letters, spaces, hyphens, and apostrophes"
    ),

  fathersStatus: z.enum(["Living", "Deceased"]),

  fathersOccupation: z
    .string()
    .trim()
    .min(2, "Father's occupation must be at least 2 characters or N/A")
    .max(50, "Father's occupation must be at most 50 characters or N/A")
    .refine(
      (val) => val === "N/A" || /^[a-zA-Z\s'-,]+$/.test(val),
      "Father's occupation must contain only letters, spaces, hyphens, and apostrophes or 'N/A'"
    ),

  fathersContactNo: z
    .string()
    .trim()
    .refine(
      (val) => val === "N/A" || /^\d{11}$/.test(val),
      "Father's contact number must be 11 digits or 'N/A'"
    ),

  mothersName: z
    .string()
    .trim()
    .min(2, "Mother's name must be at least 2 characters or N/A")
    .max(50, "Mother's name must be at most 50 characters or N/A")
    .regex(
      /^[a-zA-Z\s'-/]+$/,
      "Mother's name must contain only letters, spaces, hyphens, and apostrophes"
    ),

  mothersStatus: z.enum(["Living", "Deceased"]),

  mothersOccupation: z
    .string()
    .trim()
    .min(2, "Mother's occupation must be at least 2 characters")
    .max(50, "Mother's occupation must be at most 50 characters")
    .refine(
      (val) => val === "N/A" || /^[a-zA-Z\s'-,]+$/.test(val),
      "Mother's occupation must contain only letters, spaces, hyphens, and apostrophes or 'N/A'"
    ),

  mothersContactNo: z
    .string()
    .trim()
    .refine(
      (val) => val === "N/A" || /^\d{11}$/.test(val),
      "Mother's contact number must be 11 digits or 'N/A'"
    ),

  parentsMaritalStatus: z.enum([
    "Married",
    "Not legally married",
    "Separated",
    "Both parents remarried",
    "One parent remarried",
  ]),

  familyMonthlyIncome: z.enum([
    "Below 3,000",
    "3,001-5,000",
    "5,001-8,000",
    "8,001-10,000",
    "10,001-15,000",
    "15,001-20,000",
    "Above 20,001",
  ]),

  guardianName: z
    .string()
    .trim()
    .min(2, "Guardian's name must be at least 2 characters or N/A")
    .max(50, "Guardian's name must be at most 50 characters or N/A")
    .regex(
      /^[a-zA-Z\s'-/]+$/,
      "Guardian's name must contain only letters, spaces, hyphens, and apostrophes"
    ),

  guardianOccupation: z
    .string()
    .trim()
    .min(2, "Guardian's occupation must be at least 2 characters or N/A")
    .max(50, "Guardian's occupation must be at most 50 characters or N/A")
    .regex(
      /^[a-zA-Z\s'-/]+$/,
      "Guardian's occupation must contain only letters, spaces, hyphens, and apostrophes"
    ),

  guardianContactNo: z
    .string()
    .trim()
    .refine(
      (val) => val === "N/A" || /^\d{11}$/.test(val),
      "Guardian's contact number must be 11 digits or 'N/A'"
    ),

  relationshipWithGuardian: z
    .string()
    .trim()
    .min(2, "Guardian's relationship must be at least 2 characters or N/A")
    .max(50, "Guardian's relationship must be at most 50 characters or N/A")
    .regex(/^[a-zA-Z\s'-/]+$/, "Must contain only letters, and spaces or N/A"),

  ordinalPosition: z.enum(["Only Child", "Eldest", "Middle", "Youngest"]),

  noOfSiblings: z.coerce
    .number<number>("Number of siblings must be valid")
    .min(0, "Number of siblings cannot be negative"),

  describeEnvironment: z
    .string()
    .trim()
    .min(2, "Description must be at least 2 characters")
    .max(150, "Description must be at most 150 characters"),
})

export const academicDataSchema = z
  .object({
    generalPointAverage: z
      .string()
      .trim()
      .regex(/^\d*\.?\d*$/, "Only numbers and a single '.' are allowed")
      .min(2, "GPA must be at least 2 characters")
      .max(10, "GPA must be at most 10 characters"),

    scholar: z.enum(["Yes", "No"]),

    scholarDetails: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          return /^[a-zA-Z\s'-]+$/.test(val)
        },
        {
          message:
            "Must contain only letters, spaces, hyphens, and apostrophes",
        }
      ),

    lastSchoolAttended: z
      .string()
      .trim()
      .min(2, "School name must be at least 2 characters")
      .max(50, "School name must be at most 50 characters")
      .regex(
        /^[a-zA-Z\s.'\-,]+$/,
        "School name must contain only letters, spaces, dots, hyphens, apostrophes, and commas"
      ),

    lastSchoolAddress: z
      .string()
      .trim()
      .min(2, "School address must be at least 2 characters")
      .max(50, "School address must be at most 50 characters"),

    shsTrack: z.enum(["Academic", "Arts/Design", "Tech-Voc", "Sports"]),

    shsStrand: z.enum(["GA", "STEM", "ABM", "HUMSS"]),

    awards: z
      .string()
      .trim()
      .min(2, "School address must be at least 2 characters")
      .max(50, "School address must be at most 50 characters"),

    firstChoice: z
      .string()
      .trim()
      .min(2, "Course must be valid")
      .max(100, "Course must be at most 100 characters"),

    secondChoice: z
      .string()
      .trim()
      .min(2, "Course must be valid")
      .max(100, "Course must be at most 100 characters"),

    thirdChoice: z
      .string()
      .trim()
      .min(2, "Course must be valid")
      .max(100, "Course must be at most 100 characters"),

    studentOrg: z
      .string()
      .trim()
      .min(2, "Student Organizations must be at least 2 characters")
      .max(50, "Student Organizations must be at most 50 characters"),

    courseChoiceActor: z.enum([
      "Own Choice",
      "Parents Choice",
      "Siblings Choice",
      "Relatives Choice",
      "According to MSU-SASE score/slot",
      "Others",
    ]),
    otherCourseChoiceActor: z.string().nullable().optional(),

    reasonsForChoosingiit: z
      .array(z.string())
      .min(1, "Please select at least one reason for choosing IIT."),
    otherReasonForChoosingiit: z.string().optional().nullable(),

    reasonForCourse: z
      .string()
      .trim()
      .min(2, "Reason must be at least 2 characters")
      .max(50, "Reason must be at most 50 characters"),

    careerPursuingInFuture: z
      .string()
      .trim()
      .min(2, "Reason must be at least 2 characters")
      .max(50, "Reason must be at most 50 characters"),

    coCurricularActivities: z
      .string()
      .trim()
      .min(2, "Co-curricular activities must be at least 2 characters")
      .max(50, "Co-curricular activities must be at most 50 characters"),
  })
  .refine(
    (data) => {
      if (data.scholar === "Yes") {
        return data.scholarDetails && data.scholarDetails.length >= 2
      }
      return true
    },
    {
      message: "Scholar details must be provided when scholar is 'Yes'",
      path: ["scholarDetails"],
    }
  )
  .refine(
    (data) =>
      data.courseChoiceActor !== "Others" ||
      !!data.otherCourseChoiceActor?.trim(),
    {
      message: "Please specify your why",
      path: ["otherCourseChoiceActor"],
    }
  )
  .refine(
    (data) =>
      !data.reasonsForChoosingiit.includes("Others") ||
      !!data.otherReasonForChoosingiit?.trim(),
    {
      message:
        "Please specify your reason for choosing IIT when 'Others' is selected.",
      path: ["otherReasonForChoosingiit"],
    }
  )

export const distanceLearningSchema = z.object({
  technologyGadgets: z
    .array(z.string())
    .min(1, "Please select at least one gadget available."),

  otherOptionTechnologyGadgets: z.string().nullable().optional(),

  meansOfInternet: z
    .array(z.string())
    .min(1, "Please select at least one means of connectivity."),

  otherOptionMeansOfInternet: z.string().nullable().optional(),

  internetAccess: z.enum([
    "No internet access",
    "Limited internet access",
    "Full internet access",
  ]),

  learningReadiness: z.enum([
    "Fully ready",
    "Ready",
    "A little ready",
    "Not ready",
  ]),

  learningSpace: z
    .string()
    .trim()
    .min(2, "Learning space must be at least 2 characters")
    .max(50, "Learning space activities must be at most 50 characters"),
})

export const psychosocialDataSchema = z.object({
  personalCharacteristics: z
    .string()
    .trim()
    .min(2, "Must be at least 2 characters")
    .max(100, "Must be at most 100 characters"),

  copingMechanismBadDay: z
    .string()
    .trim()
    .min(2, "Must be at least 2 characters")
    .max(200, "Must be at most 200 characters"),

  hadCounseling: z.enum(["Yes", "No"]),

  seekProfessionalHelp: z.enum(["Yes", "No"]),

  perceiveMentalHealth: z
    .string()
    .trim()
    .min(2, "Must be at least 2 characters")
    .max(200, "Must be at most 200 characters"),

  problemSharers: z
    .array(z.string())
    .min(1, "Please select at least one to share your problem with."),

  otherOptionProblemSharer: z.string().nullable().optional(),

  needsImmediateCounseling: z.enum(["Yes", "No"]),

  concernsToDiscuss: z
    .string()
    .trim()
    .min(2, "Must be at least 2 characters")
    .max(200, "Must be at most 200 characters"),
})

export const needsAssessmentSchema = z.object({
  improvementNeeds: z
    .array(z.string())
    .min(1, "Please select at least one that apply to you."),
  othersOptionImprovementNeeds: z.string().nullable().optional(),
  financialAssistanceNeeds: z
    .array(z.string())
    .min(1, "Please select at least one that apply to you."),
  othersOptionfinancialAssistanceNeeds: z.string().nullable().optional(),
  personalSocialNeeds: z
    .array(z.string())
    .min(1, "Please select at least one that apply to you."),
  othersOptionPersonalSocialNeeds: z.string().nullable().optional(),
  upsetResponses: z
    .array(z.string())
    .min(1, "Please select at least one that apply to you."),
  othersOptionUpsetResponses: z.string().nullable().optional(),
  primaryProblemSharer: z
    .array(z.string())
    .min(1, "Please select at least one that apply to you."),
  othersOptionPrimaryProblemSharer: z.string().nullable().optional(),
})
