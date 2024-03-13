
import Image from 'next/image'
import BanBtn from './BanBtn';
import { formatDate } from './utils';

const UserRow = ({ user }: { user: IUserWithId }) => {
    let formattedBirthday: string = "undefined";
    if (user.birthday) formattedBirthday = formatDate(user.birthday);

    return (
        <tr key={user.id}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
            <td>
                <Image
                    width={36}
                    height={36}
                    src={user.imageURL ? user.imageURL : "/default_pp.jpg"}
                    alt='Profile Picture'
                    className='rounded-full object-cover mt-3 ml-3' />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
            <td className="px-6 py-4 whitespace-nowrap">{formattedBirthday}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.email_verified ? "Yes" : "No"}</td>
            <td className="px-6 py-4 whitespace-nowrap"><BanBtn userId={user.id} banned={user.banned} /></td>
        </tr>
    );
};

export default UserRow;