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
  const API_PORT = import.meta.env.VITE_API_PORT;
  const [teams, setTeams] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_PORT}/api/v1/auth/teams`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTeams(data.teams);
      })
      .catch(() => {});

    fetch(`${API_PORT}/api/v1/auth/current-user`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.data);
      })
      .catch(() => {});
  }, [API_PORT]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-3 py-6 sm:px-4 sm:py-8 lg:px-8 overflow-hidden">
        <div className="relative">
          {/* soft gradient blobs – keep them inside, reduce size */}
          <div className="pointer-events-none absolute -top-16 -left-12 h-28 w-28 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/30" />
          <div className="pointer-events-none absolute -bottom-16 -right-12 h-32 w-32 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/30" />

          <h2 className="relative text-xl sm:text-3xl md:text-4xl font-semibold text-center text-slate-900 dark:text-slate-50 mb-6 sm:mb-8">
            Explore our{" "}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              teams
            </span>
          </h2>

          {/* domain chips */}
          <div className="relative flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {domainOptions.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedTeam(domain)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-medium transition-all ${
                  selectedTeam === domain
                    ? "bg-sky-500 text-white shadow-md"
                    : "bg-white text-sky-700 border border-slate-200 hover:bg-sky-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          {selectedTeam && (
            <section className="relative bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-sm px-3 py-5 sm:px-5 sm:py-7">
              <h3 className="text-lg sm:text-2xl font-semibold text-center text-slate-900 dark:text-slate-50 mb-5 sm:mb-6">
                {selectedTeam} team members
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {(teams[selectedTeam] || []).map((member) => (
                  <Link
                    to={`/profile/${member.rollNumber}`}
                    key={member.rollNumber}
                    className="group bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 sm:p-4 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition flex items-center sm:flex-col sm:text-center gap-3"
                  >
                    <div className="relative flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 mx-0 sm:mx-auto">
                      <img
                        src={
                          member.avatarUrl ||
                          member.photoUrl ||
                          `https://ui-avatars.com/api/?name=${member.username?.charAt(
                            0
                          )}&background=0ea5e9&color=fff`
                        }
                        alt={member.name || "Avatar"}
                        className="w-full h-full rounded-full object-cover border-2 border-sky-400 group-hover:border-indigo-500 transition"
                      />
                      <div className="absolute inset-0 rounded-full ring-2 ring-white/70 dark:ring-slate-950/80" />

                      {member.role === "admin" && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] sm:text-[10px] bg-purple-600 text-white rounded-full shadow-sm">
                          Admin
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 sm:mt-1 text-left sm:text-center">
                      <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 truncate">
                        {member.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 truncate">
                        {member.email}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Roll no:{" "}
                        <span className="font-medium">
                          {member.rollNumber}
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {teams[selectedTeam]?.length === 0 && (
                <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-5">
                  No members have completed their profile in this team yet.
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default Teams;
