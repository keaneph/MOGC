import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { CircleCheckBigIcon } from "lucide-react"
import { PrimaryButton } from "./primary-button"


export function SiklabAccordion() {
    return (
        <Accordion
            type="single"
            collapsible
            className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Fill up personal information</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                    Placeholder    
                </p>
                <p>
                    Placeholder    
                </p>
                <PrimaryButton content="Guide me"/>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Interview with counselor</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                    Placeholder
                </p>
                <p>
                    Placeholder
                </p>
                <PrimaryButton content="Guide me"/>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>GG unsa may ibutang diri</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                    Placeholder
                </p>
                <p>
                    Placeholder
                </p>
                <PrimaryButton content="Guide me"/>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>GG unsa may ibutang diri</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                    Placeholder
                </p>
                <p>
                    Placeholder
                </p>
                <PrimaryButton content="Guide me"/>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger>GG unsa may ibutang diri</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                    Placeholder
                </p>
                <p>
                    Placeholder
                </p>
                <PrimaryButton content="Guide me"/>
                </AccordionContent>
            </AccordionItem>
            </Accordion>
    )
}