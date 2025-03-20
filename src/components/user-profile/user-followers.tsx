const UserFollowers = ({ followers }: { followers: any}) => {
    console.log("Followers", followers);
    return (
        <div className="w-[97%] mx-auto bg-white p-5 rounded-lg">
            {
                followers?.map((user:any) => (
                    <div className="flex items-center gap-4 border-b-2 pb-2">
                        <div className="w-12 h-12 bg-slate-300 rounded-full">
                            <img src={user?.picture}/>
                        </div>
                        <div className="text-lg font-semibold">{user?.name}</div>
                    </div>
                ))
            }
        </div>
    )
}

export default UserFollowers;