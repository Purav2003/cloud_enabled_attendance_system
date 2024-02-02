import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import Link from "next/link";
export default function Footer() {
    return (


        <footer className="fixed-bottom bg-gray-300 ">
            <div className="mx-auto w-full max-w-full">
                <div className="grid grid-cols-2 gap-8 px-20 py-6 lg:py-8 md:grid-cols-3">
                    <div>
                        <h2 className="mb-6 text-sm font-bold text-gray-900 uppercase ">Attendance System</h2>
                        <ul className="text-gray-500 dark:text-[#4a4a4a] font-medium">
                            <li className="mb-4">
                                <Link href="/dashboard" className=" hover:underline text-[#4a4a4a]">Dashboard</Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/reports" className="hover:underline text-[#4a4a4a]">Reports</Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/profile" className="hover:underline text-[#4a4a4a]">Profile</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-6 text-sm font-bold text-gray-900 uppercase ">Contact Us</h2>
                        <ul className="text-gray-500 dark:text-[#4a4a4a] font-medium">
                            <li className="mb-4">
                                <a href="#" className="hover:underline flex items-center"><FiPhone className="text-[17px] text-[#4a4a4a]" />
                                    <label className="pl-1 text-[#4a4a4a] ">+91-223321221</label></a>
                            </li>
                            <li className="mb-4 ">
                                <a href="#" className="hover:underline flex items-center"><BsEnvelope className="text-[17px] text-[#4a4a4a]" />
                                    <label className="pl-2 text-[#4a4a4a]">aaaaa@aaaa.com</label></a>
                            </li>

                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-6 text-sm font-bold text-gray-900 uppercase ">Address</h2>
                        <ul className="text-gray-500 dark:text-[#4a4a4a] font-medium">
                            <li className="mb-4">
                                <a href="#" className="hover:underline flex items-center"><CiLocationOn className="text-[17px] text-[#4a4a4a]" />
                                    <label className="pl-1 text-[14px] text-[#4a4a4a]">Lorem ipsum dolor sit amet consectetur</label>
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>
                <div className="px-4 py-6 bg-[rgba(0,0,0,0.2)] items-center text-center">
                    <span className="text-sm text-center">© 2024 <a className="text-black font-semibold">Attendance System</a>. All Rights Reserved.
                    </span>

                </div>
            </div>
        </footer>

    )
}