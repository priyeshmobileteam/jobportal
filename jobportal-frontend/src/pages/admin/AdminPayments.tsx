import { useState, useEffect } from 'react';
import api from '../../services/api';

interface Transaction {
  id: number;
  userEmail: string;
  userName: string;
  amount: number;
  currency: string;
  status: string;
  orderId: string;
  paymentId: string;
  paymentDate: string;
}

export function AdminPayments() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [toggleLoading, setToggleLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/payments');
      setTransactions(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transaction logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePremium = async (email: string, currentStatus: boolean, index: number) => {
    setToggleLoading(index);
    try {
      // Find user in DB and toggle status
      const userRes = await api.get(`/admin/users`); // Let's fetch users list to get their ID if needed, or query by email
      const users = userRes.data;
      const userObj = users.find((u: any) => u.email === email);

      if (userObj) {
        await api.post(`/admin/payments/toggle-premium/${userObj.id}?premium=${!currentStatus}`);
        fetchTransactions();
      } else {
        alert('Could not find user ID corresponding to this transaction.');
      }
    } catch (err) {
      alert('Error updating premium status.');
    } finally {
      setToggleLoading(null);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Payment Transactions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor premium plan orders and manage user premium states.</p>
        </div>
        <button
          onClick={fetchTransactions}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all"
        >
          Refresh Data
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-md px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading transactions...</div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800/30 text-sm">{error}</div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-slate-500">No payment transactions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Order / Payment ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t, idx) => (
                <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{t.userName}</div>
                    <div className="text-xs text-slate-500">{t.userEmail}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {t.currency} {t.amount}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      t.status === 'SUCCESS' ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' :
                      t.status === 'FAILED' ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400' :
                      'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-500">
                    <div>Order: {t.orderId || 'N/A'}</div>
                    <div>Payment: {t.paymentId || 'N/A'}</div>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500">
                    {new Date(t.paymentDate).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleTogglePremium(t.userEmail, t.status === 'SUCCESS', idx)}
                      disabled={toggleLoading === idx}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        t.status === 'SUCCESS' 
                          ? 'border-red-200 dark:border-red-800/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                          : 'border-green-200 dark:border-green-800/40 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20'
                      }`}
                    >
                      {toggleLoading === idx ? 'Updating...' : t.status === 'SUCCESS' ? 'Revoke Premium' : 'Grant Premium'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
