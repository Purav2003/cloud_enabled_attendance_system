import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";

export default function Footer() {
    return (


        <footer className="fixed-bottom bg-white dark:bg-gray-900">
            <div className="mx-auto w-full max-w-full">
                <div className="grid grid-cols-2 gap-8 px-20 py-6 lg:py-8 md:grid-cols-3">
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Attendance System</h2>
                        <ul className="text-gray-500 dark:text-gray-400 font-medium">
                            <li className="mb-4">
                                <a href="#" className=" hover:underline">Dashboard</a>
                            </li>
                            <li className="mb-4">
                                <a href="#" className="hover:underline">Reports</a>
                            </li>
                            <li className="mb-4">
                                <a href="#" className="hover:underline">Profile</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Contact Us</h2>
                        <ul className="text-gray-500 dark:text-gray-400 font-medium">
                            <li className="mb-4">
                                <a href="#" className="hover:underline flex items-center"><FiPhone className="text-[17px]" />
                                    <label className="pl-1 ">+91-223321221</label></a>
                            </li>
                            <li className="mb-4 ">
                                <a href="#" className="hover:underline flex items-center"><BsEnvelope className="text-[17px]" />
                                    <label className="pl-2">aaaaa@aaaa.com</label></a>
                            </li>

                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Address</h2>
                        <ul className="text-gray-500 dark:text-gray-400 font-medium">
                            <li className="mb-4">
                                <a href="#" className="hover:underline flex items-center"><CiLocationOn className="text-[17px]" />
                                    <label className="pl-1 text-[14px]">786 Bauch Mills, Muellerland, UT 51968-8910</label>
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>
                <div className="px-4 py-6 bg-gray-800 items-center text-center">
                    <span className="text-sm text-gray-500 dark:text-gray-300 text-center">© 2024 <a>Attendance System</a>. All Rights Reserved.
                    </span>

                </div>
            </div>
        </footer>

    )
}