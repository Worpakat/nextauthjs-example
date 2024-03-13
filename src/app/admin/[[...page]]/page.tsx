import { DBService } from "@/db_service/db_service";
import UserRow from "../UserRow";
import { getPageFromRoute } from "../utils";
import Pagination from "../Pagination";

const USERS_PER_PAGE = 10;

export default async function Administration({ params }: { params: { page: string[] } }) {
    const currentPage = getPageFromRoute(params.page);
    const usersRaw = await DBService.getUsersByBatch(USERS_PER_PAGE, currentPage);
    const userCount = await DBService.getUserCount();
    const totalPages = Math.ceil(userCount / USERS_PER_PAGE);

    const users: IUserWithId[] = usersRaw.map((user: any) => {
        return {
            id: user._id.toString(),
            username: user.name,
            email: user.email,
            email_verified: user.email_verified,
            imageURL: user.image.URL,
            role: user.role,
            banned: user.banned,
            birthday: user.birthday ? new Date(user.birthday) : undefined
        } as IUserWithId
    })

    return (
        <div className="max-w-7xl mx-auto pt-4 pb-6 flex flex-col items-center justify-between gap-6">
            <h1 className="text-2xl font-bold">User Administration</h1>
            <div className="w-full">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 uppercase tracking-wider">P.P.</th>
                            <th className="px-6 py-3 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 uppercase tracking-wider">User Role</th>
                            <th className="px-6 py-3 uppercase tracking-wider">Birthday</th>
                            <th className="px-6 py-3 uppercase tracking-wider">E.Verified</th>
                            <th className="px-6 py-3 uppercase tracking-wider">Banned</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => <UserRow key={index} user={user} />)}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
};
