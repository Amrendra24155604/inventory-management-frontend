import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const domainOptions = [
  "Web Development",
  "App Development",
  "Android/Spring Boot",
  "Internet of Things(IOT)",
  "Competitive Programming",
  "Machine Learning",
  "Administration",
  "Content Writing",
  "Graphic Design / UIUX",
  "Marketing & Management",
  "Video Editing / Photography",
];

function Teams() {
   const API_PORT= import.meta.env.VITE_API_PORT;
  const [teams, setTeams] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("");
  const [user, setUser] = useState(null); // current viewer

  useEffect(() => {
    fetch(`${API_PORT}/api/v1/auth/teams`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
        
          setTeams(data.teams);
          console.log(data.teams);
          
      }});

    fetch(`${API_PORT}/api/v1/auth/current-user`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.data);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 px-6 py-10">
      <div className="relative max-w-7xl mx-auto">
        

        <h2 className="text-4xl font-bold text-center text-indigo-700 dark:text-white mb-12 mt-10">
          Explore Our Teams
        </h2>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
          {domainOptions.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedTeam(domain)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedTeam === domain
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-indigo-600 dark:text-white border hover:bg-indigo-100 dark:hover:bg-gray-700"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {selectedTeam && (
          <section className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 sm:p-10">
            <h3 className="text-2xl font-semibold text-indigo-700 dark:text-white text-center mb-8">
              {selectedTeam} Team Members
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {(teams[selectedTeam] || []).map((member, idx) => (
                <Link
                  to={`/profile/${member.rollNumber}`}
                  key={idx}
                  className="block bg-indigo-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 text-center"
                >
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <img
                      src={
                        member.avatarUrl ||member.photoUrl||
                        `https://ui-avatars.com/api/?name=${member.username?.charAt(0)}&background=4c51bf&color=fff`
                      }
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover border-4 border-indigo-500"
                    />
                    <div className="absolute inset-0 rounded-full ring-2 ring-white dark:ring-gray-900"></div>

                    {/* Admin Badge on Avatar */}
                    {member.role === "admin" && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-purple-700 text-white rounded-full shadow-md z-10">
                        Admin
                      </div>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {member.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Roll No: {member.rollNumber}</p>
                </Link>
              ))}
            </div>

            {teams[selectedTeam]?.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
                No members have completed their profile in this team yet.
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default Teams;