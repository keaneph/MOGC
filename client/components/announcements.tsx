import Link from "next/link" 
import { MessageSquareWarningIcon } from "lucide-react"; 
import { TooltipThis } from "./tooltip-this";
import { DrawerDemo } from "./drawer";
import { PrimaryButton } from "./primary-button";


export function Announcements() {
    return (
        <div className="flex border-b h-24 items-center gap-4 justify-between px-12">
            {/* icon section */}
            <div className="flex-shrink-0 mr-2">
                <MessageSquareWarningIcon className="w-5.5 h-5.5 text-main3"/>
            </div>

            {/* text section */}
            <div style={{fontWeight: 450, fontSize: "0.9rem"}} className="md:text-left leading-relaxed text-center tracking-wide">
                Thank you for testing the Office of the Guidance and Counseling web application! This is a work
                in progress and you can&nbsp;

                <TooltipThis label="See what features are coming next!">
                    <Link href="/roadmap" className="hover:underline underline-offset-4 decoration-2 text-link">
                        view the roadmap here.
                    </Link>
                </TooltipThis>
                &nbsp;Like what you&#39;re seeing?&nbsp;
                <TooltipThis label="See all features implemented so far!">
                     <Link href="/features" className="hover:underline underline-offset-4 decoration-2 text-link">
                        View the full features here.
                     </Link>
                </TooltipThis>
            </div>

            {/* button section */}
            <div>
                <TooltipThis label="Report any bugs you encounter!">
                    <DrawerDemo
                        trigger={<PrimaryButton content="Report bugs" />}
                        />
                </TooltipThis>
            </div>
        </div>
    )
}