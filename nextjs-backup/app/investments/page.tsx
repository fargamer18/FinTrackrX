"use client";

import { useState, useEffect } from 'react';
import { Plus, RefreshCw, TrendingUp, TrendingDown, Download, Filter, Search } from 'lucide-react';

interface Investment {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  currency: string;
  exchange: string;
  currentValue: number;
  costValue: number;
  gain: number;
  gainPercent: number;
  purchase_date: string;
  type: string;
}

interface Portfolio {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
}

interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'dividend';
  symbol: string;
  name: string;
  quantity?: number;
  price: number;
  total: number;
  status: 'completed' | 'pending';
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [stockSearchTerm, setStockSearchTerm] = useState('');
  const [stockSearchResults, setStockSearchResults] = useState<any[]>([]);
  const [showStockSearch, setShowStockSearch] = useState(false);
  const [searchingStocks, setSearchingStocks] = useState(false);

  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
    type: 'stocks'
  });

  useEffect(() => {
    fetchInvestments();
    fetchTransactions();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await fetch('/api/investments');
      const data = await response.json();
      setInvestments(data.investments || []);
      setPortfolio(data.portfolio);
    } catch (error) {
      console.error('Failed to fetch investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    // Mock transaction data - replace with actual API call
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: '2024-01-15',
        type: 'buy',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        price: 150.00,
        total: 1500.00,
        status: 'completed'
      },
      {
        id: '2',
        date: '2024-01-10',
        type: 'buy',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        quantity: 5,
        price: 250.00,
        total: 1250.00,
        status: 'completed'
      },
      {
        id: '3',
        date: '2024-01-05',
        type: 'dividend',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 100.00,
        total: 100.00,
        status: 'completed'
      }
    ];
    setTransactions(mockTransactions);
  };

  const searchStocks = async (query: string) => {
    if (query.length < 2) {
      setStockSearchResults([]);
      setShowStockSearch(false);
      return;
    }

    console.log('🔍 Starting search for:', query);
    setSearchingStocks(true);
    try {
      const url = `/api/stocks/search?q=${encodeURIComponent(query)}`;
      console.log('📡 Fetching from:', url);
      
      const response = await fetch(url);
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      console.log('📦 Results array length:', data.results?.length);
      
      setStockSearchResults(data.results || []);
      console.log('🎯 Set stockSearchResults, length:', data.results?.length);
      
      setShowStockSearch(true);
      console.log('🎯 Set showStockSearch to true');
      
      console.log('✅ Search completed. Found', data.results?.length || 0, 'results');
    } catch (error) {
      console.error('❌ Stock search failed:', error);
      setStockSearchResults([]);
    } finally {
      setSearchingStocks(false);
    }
  };

  // Test function for debugging
  const testSearch = () => {
    console.log('🧪 Testing Indian stock search function...');
    searchStocks('tatta'); // Test search for Tata companies
  };

  const handleStockSelect = (stock: any) => {
    setFormData({ 
      ...formData, 
      symbol: stock.symbol,
    });
    setStockSearchTerm(stock.symbol + ' - ' + stock.description);
    setShowStockSearch(false);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setStockSearchTerm('');
    setStockSearchResults([]);
    setShowStockSearch(false);
    setFormData({
      symbol: '',
      quantity: '',
      purchasePrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: '',
      type: 'stocks'
    });
  };

  const syncPrices = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/investments/sync-prices', {
        method: 'POST',
      });
      await response.json();
      await fetchInvestments();
    } catch (error) {
      console.error('Failed to sync prices:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: formData.symbol.toUpperCase(),
          quantity: parseFloat(formData.quantity),
          purchasePrice: parseFloat(formData.purchasePrice),
          purchaseDate: formData.purchaseDate,
          notes: formData.notes
        }),
      });

      if (response.ok) {
        closeAddModal();
        await fetchInvestments(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to add investment:', error);
    }
  };

  const deleteInvestment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this investment?')) return;
    
    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchInvestments();
      }
    } catch (error) {
      console.error('Failed to delete investment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  const filteredInvestments = investments.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         inv.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || inv.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Investments</h1>
          <p className="text-gray-600 dark:text-gray-400">Maximize your investment potential with personalized advice</p>
        </div>

        {/* Portfolio Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Portfolio Overview</h3>
          
          {portfolio && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  ₹{Number(portfolio?.totalValue || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  ₹{Number(portfolio?.totalCost || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-1 ${Number(portfolio?.totalGain || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(portfolio?.totalGain || 0) >= 0 ? '+' : ''}₹{Number(portfolio?.totalGain || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Gain/Loss</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-1 ${Number(portfolio?.totalGainPercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(portfolio?.totalGainPercent || 0) >= 0 ? '+' : ''}{Number(portfolio?.totalGainPercent || 0).toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Return %</div>
              </div>
            </div>
          )}
        </div>

        {/* Investment Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Investment Details</h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Download size={16} />
                    EXPORT
                  </button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search investments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="stocks">Stocks</option>
                    <option value="mutual-funds">Mutual Funds</option>
                    <option value="etfs">ETFs</option>
                  </select>
                  
                  <button
                    onClick={syncPrices}
                    disabled={syncing}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                    Sync Prices
                  </button>
                  
                  <button
                    onClick={() => {
                      setStockSearchTerm('');
                      setStockSearchResults([]);
                      setShowStockSearch(false);
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Plus size={16} />
                    Add Investment
                  </button>
                  
                  <button
                    onClick={testSearch}
                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    🧪 Test Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purchase Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shares/Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purchase Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gain/Loss</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No investments found. {searchTerm && 'Try adjusting your search terms or '} Click "Add Investment" to get started.
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map((inv, index) => (
                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{inv.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {inv.type || 'Stocks'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                        {inv.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {inv.purchase_date ? new Date(inv.purchase_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        {inv.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        {inv.currency} {Number(inv.purchase_price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900 dark:text-white">
                        ₹{Number(inv.currentValue || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm font-semibold ${Number(inv.gainPercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Number(inv.gainPercent || 0) >= 0 ? '+' : ''}{Number(inv.gainPercent || 0).toFixed(2)}%
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Rows per page: 10
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              1–{Math.min(10, filteredInvestments.length)} of {filteredInvestments.length}
            </div>
          </div>
        </div>

        {/* Investment Performance Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Investment Performance</h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400">Performance Chart Coming Soon</div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Transaction History</h3>
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                <Download size={16} />
                EXPORT
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Name</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price per Share</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        transaction.type === 'sell' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {transaction.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      {transaction.quantity || '--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      ₹{Number(transaction.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900 dark:text-white">
                      ₹{Number(transaction.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Rows per page: 10
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              1–{Math.min(10, transactions.length)} of {transactions.length}
            </div>
          </div>
        </div>

        {/* Add Investment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add Investment</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Investment Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="stocks">Stocks</option>
                    <option value="mutual-funds">Mutual Funds</option>
                    <option value="etfs">ETFs</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Symbol</label>
                  <input
                    type="text"
                    value={stockSearchTerm || formData.symbol}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log('🎯 Input changed to:', value);
                      setStockSearchTerm(value);
                      setFormData({ ...formData, symbol: value.split(' ')[0] }); // Extract symbol part
                      console.log('🎯 About to call searchStocks with:', value);
                      searchStocks(value);
                    }}
                    onFocus={() => {
                      if (stockSearchTerm.length >= 2) {
                        setShowStockSearch(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding to allow for clicks on dropdown items
                      setTimeout(() => setShowStockSearch(false), 200);
                    }}
                    placeholder="Search for stocks (e.g., Apple, AAPL)"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Stock Search Results Dropdown */}
                  {showStockSearch && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div className="px-4 py-2 text-xs text-blue-600 bg-blue-50 border-b">
                        DEBUG: Dropdown is showing! Found {stockSearchResults.length} results
                      </div>
                      {searchingStocks && (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">
                          Searching stocks...
                        </div>
                      )}
                      {!searchingStocks && stockSearchResults.length === 0 && stockSearchTerm.length >= 2 && (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">
                          No stocks found. Try a different search term.
                        </div>
                      )}
                      {!searchingStocks && stockSearchResults.map((stock, index) => (
                        <div
                          key={index}
                          onClick={() => handleStockSelect(stock)}
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {stock.symbol}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {stock.description}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            {stock.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => closeAddModal()}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Investment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
