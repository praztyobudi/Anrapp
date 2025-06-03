"use client";

import { useEffect, useState } from "react";
import FormIde from "./formide";
import ListIde from "./riwayat-ide";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Idea } from "./types";
import Image from "next/image";

export default function Home(p0: unknown) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const addIdea = async (
    idea: Idea
  ): Promise<{ success: boolean; error?: Error }> => {
    try {
      const res = await fetch("https://app.prazelab.my.id/api/ide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: idea.from,
          message: idea.idea,
          department: idea.to,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menambahkan ide");
      }

      setIdeas([idea, ...ideas]);
      return { success: true };
    } catch (error) {
      console.error("Create error:", error);
      return { success: false, error };
    }
  };

  const updateIdea = async (updatedIdea: Idea) => {
    try {
      const res = await fetch(
        `https://app.prazelab.my.id/api/ide/${updatedIdea.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedIdea.from,
            message: updatedIdea.idea,
            department: updatedIdea.to,
          }),
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData?.message || "Gagal mengupdate ide");
      }

      // setIdeas(prev => prev.map(item =>
      //   item.id === updatedIdea.id ? updatedIdea : item
      // ));
      // setSelectedIdea(null);

      const ideupdate = {
        ...updatedIdea,
        updated_at: resData.data.updated_at,
      };
      setIdeas((prev) => {
        // Hapus item lama
        const filtered = prev.filter((item) => item.id !== updatedIdea.id);
        // Tambahkan item yang baru diupdate ke paling atas
        return [ideupdate, ...filtered];
      });
      return { success: true };
    } catch (error) {
      console.error("Update error:", error);
      return { success: false, error };
    }
  };

  const refreshData = async () => {
    setStatusMsg("Please wait...");
    setLoading(true);
    try {
      const res = await fetch("https://app.prazelab.my.id/api/ide");
      if (!res.ok) throw new Error("Fetch failed");

      const result = await res.json();
      const data = Array.isArray(result.data) ? result.data : [result.data];

      const mappedIdeas: Idea[] = data.map((item: any) => ({
        id: item?.id ?? 0,
        from: item?.name ?? "Anonim",
        to: item?.department ?? "Tidak diketahui",
        idea: item?.message ?? "",
        date: item?.updated_at ?? "",
      }));

      setIdeas(mappedIdeas);
      setStatusMsg("Updated!");
    } catch (error) {
      console.error("Gagal refresh data:", error);
      setStatusMsg("Gagal memuat data. Coba lagi.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(""), 3000); // reset setelah 3 detik
    }
  };
  useEffect(() => {
    refreshData(); // initial fetch
  }, []);
  const goBack = () => {
    router.back();
  };

  const handleCancelEdit = () => {
    setSelectedIdea(null); // ini bikin mode jadi 'create'
  };

  return (
    <main className="min-h-screen bg-green-700 flex flex-col items-center px-6 py-8">
      <div className="flex gap-4 w-full justify-between left-4">
        <button
          onClick={goBack}
          className="self-start flex items-center gap-2 text-white hover:text-green-900 font-semibold"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <span className="pt-1">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="50t"
            height="20pt"
            viewBox="0 0 1296.000000 265.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,265.000000) scale(0.100000,-0.100000)"
              fill="#ffffff"
              stroke="none"
            >
              <path
                d="M2255 2624 c-311 -69 -561 -311 -641 -619 -26 -103 -25 -286 4 -387
27 -97 61 -173 109 -245 120 -181 332 -323 543 -364 88 -17 260 -15 346 4 280
61 513 262 598 517 48 144 59 358 20 401 -16 18 -35 19 -410 19 -344 0 -395
-2 -408 -16 -13 -13 -16 -43 -16 -168 0 -105 4 -156 12 -164 8 -8 57 -12 154
-12 116 0 145 -3 158 -16 19 -19 12 -36 -36 -81 -94 -91 -291 -112 -421 -47
-76 39 -113 70 -158 133 -86 120 -102 275 -40 407 40 86 117 166 200 207 61
30 72 32 171 32 96 0 110 -3 164 -29 33 -16 91 -60 131 -97 45 -43 81 -69 95
-69 33 0 307 177 314 202 6 27 -11 59 -71 130 -97 116 -236 206 -385 249 -99
29 -331 36 -433 13z"
              />
              <path
                d="M5629 2378 c-1 -145 -4 -276 -8 -293 -6 -29 -7 -28 -29 30 -31 85
-105 177 -219 275 -54 46 -110 95 -124 108 l-27 24 -57 -38 -57 -38 29 -26
c16 -14 87 -76 158 -138 71 -62 165 -140 209 -172 128 -94 116 -71 115 -227
-1 -76 -4 -149 -8 -163 -7 -24 -8 -24 -20 11 -28 86 -134 210 -266 313 -116
91 -354 248 -365 241 -5 -3 -29 -38 -52 -77 -41 -68 -41 -71 -22 -85 230 -173
510 -362 629 -424 l90 -47 -2 -103 c-3 -143 -13 -250 -23 -244 -5 3 -18 26
-30 50 -56 116 -186 229 -397 347 -244 136 -342 188 -352 188 -7 0 -11 -34
-11 -95 l0 -95 43 -27 c120 -76 441 -254 585 -325 159 -78 162 -80 162 -112
l0 -32 -67 -1 c-77 0 -134 -20 -176 -61 -52 -49 -52 -63 0 -35 75 43 166 43
333 2 157 -38 284 -44 335 -16 l30 16 -54 1 c-29 0 -93 9 -142 21 l-88 20 -7
46 c-8 51 1 72 37 90 13 7 78 39 144 71 124 61 282 148 490 270 136 79 132 73
120 200 l-7 73 -31 -20 c-18 -10 -113 -63 -212 -116 -99 -54 -219 -124 -267
-157 -106 -73 -212 -183 -245 -255 -13 -29 -29 -53 -34 -53 -5 0 -9 21 -10 48
0 26 -4 101 -9 167 -4 70 -4 125 1 131 5 6 37 25 72 42 118 58 642 417 654
448 7 19 -79 155 -95 149 -31 -12 -344 -229 -405 -282 -91 -77 -161 -163 -201
-246 l-33 -68 -8 163 -7 162 28 24 c16 13 63 49 105 80 75 56 344 287 368 316
10 12 4 20 -40 50 l-52 35 -61 -47 c-33 -26 -106 -92 -162 -147 -99 -98 -116
-124 -172 -255 -8 -19 -11 22 -11 166 -1 105 -4 239 -8 297 l-6 107 -29 0 -28
0 -1 -262z"
              />
              <path
                d="M683 2610 c-12 -5 -29 -19 -37 -32 -19 -30 -637 -1476 -644 -1507
-10 -46 14 -51 230 -51 154 0 205 3 227 14 20 11 38 38 66 100 21 48 48 92 61
101 19 12 67 15 274 15 163 0 259 -4 272 -11 11 -6 38 -48 59 -94 60 -128 54
-125 291 -125 118 0 207 4 219 10 10 6 19 21 19 33 0 12 -145 361 -322 776
-310 725 -324 754 -355 767 -37 16 -323 19 -360 4z m255 -812 c48 -117 59
-154 50 -165 -8 -10 -39 -13 -132 -11 -114 3 -121 4 -124 24 -2 11 18 72 44
135 59 144 71 169 87 169 7 0 41 -68 75 -152z"
              />
              <path
                d="M3380 2600 c-20 -20 -20 -33 -20 -780 0 -747 0 -760 20 -780 18 -18
33 -20 195 -20 233 0 215 -19 215 234 0 164 3 197 16 210 19 19 92 21 129 4
16 -7 70 -73 133 -160 136 -191 192 -260 222 -275 18 -9 89 -13 242 -13 200 0
218 1 227 18 13 25 6 35 -188 282 -88 113 -161 211 -161 219 0 8 35 48 78 90
120 117 172 245 172 417 -1 305 -187 522 -484 563 -43 6 -232 11 -427 11 -336
0 -350 -1 -369 -20z m753 -394 c96 -39 133 -171 73 -258 -40 -59 -73 -68 -241
-68 -104 0 -155 4 -163 12 -8 8 -12 56 -12 152 0 185 -9 176 172 176 94 0 149
-4 171 -14z"
              />
              <path
                d="M6740 2600 c-20 -20 -20 -33 -20 -780 0 -747 0 -760 20 -780 19 -19
33 -20 198 -20 161 0 181 2 195 18 15 16 17 51 17 279 0 239 1 261 18 276 16
15 54 17 330 17 269 0 313 2 326 16 13 13 16 45 16 189 0 168 -1 174 -22 189
-19 14 -68 16 -330 16 -265 0 -309 2 -322 16 -12 11 -16 35 -16 84 0 106 -22
100 402 100 343 0 358 1 368 19 6 11 10 89 10 180 0 148 -2 163 -20 181 -20
20 -33 20 -585 20 -552 0 -565 0 -585 -20z"
              />
              <path
                d="M8435 2606 c-28 -12 -54 -70 -359 -781 l-329 -768 22 -19 c21 -16 44
-18 225 -18 171 0 205 2 225 17 13 9 41 53 63 99 21 46 48 90 61 99 31 21 504
22 546 1 20 -11 38 -38 66 -101 28 -63 46 -90 66 -101 34 -17 408 -21 440 -4
10 6 19 21 19 33 0 31 -629 1494 -656 1526 -22 26 -23 26 -191 28 -124 2 -176
-1 -198 -11z m258 -801 c32 -77 56 -149 55 -160 -3 -19 -12 -20 -129 -23 -109
-2 -128 0 -133 13 -3 9 21 82 55 166 46 112 66 149 78 147 9 -2 37 -56 74
-143z"
              />
              <path
                d="M9661 2601 c-21 -21 -21 -24 -21 -781 0 -747 0 -760 20 -780 19 -19
33 -20 198 -20 161 0 181 2 195 18 15 16 17 46 17 214 0 227 0 228 89 228 49
0 57 -3 90 -38 20 -21 95 -118 166 -216 96 -132 138 -182 162 -192 24 -10 88
-14 247 -14 196 0 216 2 225 18 13 24 10 29 -154 237 -204 260 -198 251 -191
278 3 13 24 36 45 50 77 51 165 196 190 315 16 75 14 207 -4 277 -38 150 -139
283 -262 348 -130 68 -144 69 -590 74 -396 5 -402 4 -422 -16z m787 -409 c70
-51 95 -165 49 -233 -12 -18 -38 -44 -56 -56 -32 -21 -44 -23 -184 -23 -197 0
-187 -9 -187 167 0 182 -7 176 193 171 140 -3 155 -5 185 -26z"
              />
              <path
                d="M11210 2600 c-20 -20 -20 -33 -20 -780 0 -747 0 -760 20 -780 19 -19
33 -20 198 -20 160 0 181 2 195 18 15 16 17 62 19 388 l3 369 22 0 c18 0 56
-54 211 -305 177 -286 190 -305 217 -305 27 0 41 19 219 308 160 257 194 307
213 307 l23 0 0 -370 c0 -357 1 -371 20 -390 19 -19 33 -20 198 -20 161 0 181
2 195 18 16 17 17 86 17 785 l0 767 -24 15 c-21 14 -52 16 -190 13 -148 -3
-167 -5 -192 -24 -16 -11 -124 -162 -242 -335 -117 -173 -220 -316 -228 -317
-9 -2 -23 3 -32 12 -9 8 -111 155 -227 325 -160 237 -218 314 -242 326 -24 11
-69 15 -192 15 -148 0 -163 -2 -181 -20z"
              />
              <path
                d="M6125 1197 c-52 -14 -103 -20 -197 -21 -121 -1 -125 -2 -90 -15 23
-9 78 -15 147 -15 113 -1 145 8 210 58 25 19 18 18 -70 -7z"
              />
              <path
                d="M5375 1086 c-17 -7 -37 -21 -45 -32 -13 -17 -13 -18 1 -7 35 28 112
35 190 18 157 -34 186 -38 225 -30 l39 8 -61 8 c-34 4 -92 17 -129 28 -76 24
-175 27 -220 7z"
              />
            </g>
          </svg>
        </span>
      </div>
      <h1 className="text-5xl font-bold pt-6 text-white text-center">
        Ide kreatifmu, semangat kita semua!
      </h1>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-screen-2xl pt-4">
        <div className="w-full md:w-3/3">
          <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col my-6">
            <FormIde
              onSubmit={selectedIdea ? updateIdea : addIdea}
              defaultValue={selectedIdea ?? undefined}
              mode={selectedIdea ? "edit" : "create"}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col my-6">
            <ListIde
              onEdit={setSelectedIdea}
              ideas={ideas}
              setIdeas={setIdeas}
              refreshData={refreshData}
              statusMsg={statusMsg}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
