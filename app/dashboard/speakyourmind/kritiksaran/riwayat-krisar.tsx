export default function RiwayatKrisar({ krisars: krisars }: { krisars: any[] }) {
    return (
      <div className="flex flex-col gap-4">
        {krisars.length === 0 ? (
          <div className="text-center text-gray-400 text-sm">Riwayat Kritik & Saranmu</div>
        ) : (
          krisars.map((item, index) => (
            <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-gray-700">{item.from}</div>
                <div className="text-xs text-gray-400">{item.date}</div>
              </div>
              <div className="text-green-600 text-sm mt-1">{item.to}</div>
            </div>
          ))
        )}
      </div>
    );
  }
  