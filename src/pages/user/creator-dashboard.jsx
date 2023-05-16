import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { authOptions } from "../api/auth/[...nextauth]";
// import prisma from "../../../prisma/db"
import { getServerSession } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
    AcademicCapIcon,
    BanknotesIcon,
    HeartIcon,
    UsersIcon,
} from "@/components/icons";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import LoaderContext from "@/contexts/loader";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const getServerSideProps = async ({ req, res, params }) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.admin) {
        res.setHeader("location", "/");
        res.statusCode = 302;
        res.end();
        return {
            props: {},
        };
    }

    return {
        props: {},
    };
};

function Course({ course }) {
    return (
        <div className="shadow-sm shadow-zinc-300 p-3 rounded">
            {/* {course.id} */}
            <h3 className="font-semibold">{course.title}</h3>

            <div>
                <h4 className="my-2 text-sm">Details:</h4>
                <p className="text-sm">
                    Total students:{" "}
                    <span className="text-zinc-500">{course.totalStudents}</span>
                </p>
                <p className="text-sm">
                    Total orders:{" "}
                    <span className="text-zinc-500">{course.numOrders}</span>
                </p>
                <p className="text-sm">
                    Total wishes: <span className="text-zinc-500">{course.wishlist}</span>
                </p>
            </div>
        </div>
    );
}
export default function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [dates, setDates] = useState([]);
    const { setShowLoader } = useContext(LoaderContext)
    const [earnings, setEarnings] = useState([]);

    useEffect(() => {
        setShowLoader(false)
        async function getCourses() {
            try {
                const result = await axios.get("/api/app/teacher/summary");
                if (result.status === 200) {
                    setCourses(result.data.data);

                    // set chart data
                    //   res.forEach((item) => {
                    //     earnings.push(item.earnings);
                    //     dates.push(moment(item.createdAt).format("YYYY-MM-DD"));
                    //   });

                    const aggr = result.data.data.reduce((acc, course) => acc.concat(course.students.map(student => student.createdAt)), []);
                    console.log(aggr);
                } else {
                    console.log(result);
                }
            } catch (err) {
                if (err.response) {
                    alert(err.response.data.message);
                } else {
                    alert("Something went wrong");
                    console.log(err.message);
                }
            }
        }
        getCourses();
    }, []);
    return (
        <>
            <Nav />
            <section className="py-4 xs:px-6 lg:px-0 border-t border-gray-200">
                <div className="custom-container">
                    <h1 className="my-5 text-2xl font-semibold">Dashboard</h1>

                    <article className="grid md:grid-cols-4 xs:grid-cols-2 gap-4 mb-5">
                        <div className="shadow-sm shadow-zinc-300 px-3 py-4 rounded text-center">
                            <AcademicCapIcon
                                width={40}
                                className="mx-auto text-zinc-500 mb-1"
                            />
                            <h2 className="text-3xl font-semibold text-zinc-500">
                                {courses.length}
                            </h2>
                            <p className="md:text-lg xs:text-sm">Number of courses</p>
                        </div>
                        <div className="shadow-sm shadow-zinc-300 px-3 py-4 rounded text-center">
                            <UsersIcon width={40} className="mx-auto text-zinc-500 mb-1" />
                            <h2 className="text-3xl font-semibold text-zinc-500">
                                {
                                    [
                                        ...new Set(
                                            courses.reduce(
                                                (acc, cur) => acc.concat(cur.studentIds),
                                                []
                                            )
                                        ),
                                    ].length
                                }
                            </h2>
                            <p className="md:text-lg xs:text-sm">Number of students</p>
                        </div>
                        <div className="shadow-sm shadow-zinc-300 px-3 py-4 rounded text-center">
                            <BanknotesIcon
                                width={40}
                                className="mx-auto text-zinc-500 mb-1"
                            />

                            <h2 className="text-3xl font-semibold text-zinc-500">
                                £
                                {courses.reduce((acc, cur) => {
                                    acc += cur.numOrders * cur.price;
                                    return acc;
                                }, 0)}
                            </h2>
                            <p className="md:text-lg xs:text-sm">Total revenue</p>
                        </div>
                        <div className="shadow-sm shadow-zinc-300 px-3 py-4 rounded text-center">
                            <HeartIcon width={40} className="mx-auto text-zinc-500 mb-1" />
                            <h2 className="text-3xl font-semibold text-zinc-500">2</h2>
                            <p className="md:text-lg xs:text-sm">Number of wishes</p>
                        </div>
                    </article>

                    <div className="px-4 my-6">
                        <Line
                            data={{
                                labels: dates,
                                datasets: [
                                    {
                                        label: "Earnings over time",
                                        data: earnings,
                                        backgroundColor: ["rgba(75, 192, 192, 0.6)"],
                                        borderWidth: 4,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                title: { text: "Earnings over time", display: true },
                                scales: {
                                    yAxes: [
                                        {
                                            ticks: {
                                                autoSkip: true,
                                                maxTicksLimit: 10,
                                                beginAtZero: true,
                                            },
                                            gridLines: {
                                                display: false,
                                            },
                                        },
                                    ],
                                    xAxes: [
                                        {
                                            gridLines: {
                                                display: false,
                                            },
                                        },
                                    ],
                                },
                            }}
                        />
                    </div>

                    <article className="course-section">
                        <h2 className="text-xl mb-4">Your course stats</h2>

                        <div className="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4 mb-5">
                            {courses.map((course) => (
                                <Course course={course} key={course.id} />
                            ))}
                        </div>
                    </article>
                </div>
            </section>
            <Footer />
        </>
    );
}
