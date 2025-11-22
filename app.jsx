// Add this helper function near the top of your App component
const api = {
  // Base URL - change this if your backend runs on a different port
  baseUrl: 'http://localhost:5000',
  
  // Login function
  login: async (email, password) => {
    try {
      const response = await fetch(`${api.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Get projects
  getProjects: async () => {
    const response = await fetch(`${api.baseUrl}/api/projects`);
    const data = await response.json();
    return data.projects;
  },
  
  // Create order
  createOrder: async (projectId, userId) => {
    const response = await fetch(`${api.baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, userId })
    });
    const data = await response.json();
    return data;
  },
  
  // Get orders
  getOrders: async () => {
    const response = await fetch(`${api.baseUrl}/api/orders`);
    const data = await response.json();
    return data.orders;
  }
};

// Update your handleLogin function
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    const result = await api.login(email, password);
    
    if (result.user.role === 'admin') {
      setAuthMode('admin');
    } else {
      setAuthMode('client');
    }
    
    // In a real app, you'd store the token
    console.log('Login successful:', result);
  } catch (error) {
    alert(error.message);
  }
};

// Update the useEffect to fetch real projects
useEffect(() => {
  const fetchProjects = async () => {
    try {
      const projectsData = await api.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  
  fetchProjects();
}, []);

// Update handlePurchase
const handlePurchase = async (project) => {
  if (authMode === 'guest') {
    setAuthMode('login');
    setSelectedProject(project);
  } else if (authMode === 'client') {
    try {
      // Simulate user ID (in real app, get from auth token)
      const userId = '2'; // Client user ID
      
      const result = await api.createOrder(project.id, userId);
      alert(`✅ Project "${project.title}" purchased successfully!\nOrder ID: ${result.order.id}`);
      
      // Refresh orders
      const ordersData = await api.getOrders();
      setOrders(ordersData);
    } catch (error) {
      alert('❌ Failed to purchase project: ' + error.message);
    }
  }
};
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Smartphone, Shield, Brain, CircuitBoard, Network, Lock, Zap, TrendingUp, Users, Star, CheckCircle, ArrowRight, Menu, X, Mail, Phone, MapPin, Github, Linkedin, Twitter, ChevronRight, Award, Briefcase, GraduationCap, Clock, Download, User, Package, Settings, LogOut, Check, UserPlus, Key, AlertCircle, Calendar, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [authMode, setAuthMode] = useState('guest'); // guest, login, signup, client, admin
  const [showPassword, setShowPassword] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const contactFormRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);

  // Mock data for projects with status tracking
  const mockProjects = [
    { 
      id: 1, 
      title: "Smart Home Automation System", 
      category: "iot", 
      description: "A comprehensive IoT solution for home automation with mobile app control and voice assistant integration.", 
      image: "https://placehold.co/600x400/4f46e5/white?text=IoT+Project",
      features: ["Real-time monitoring", "Energy optimization", "Mobile app control"],
      price: 299,
      status: "available"
    },
    { 
      id: 2, 
      title: "AI-Powered Medical Diagnosis", 
      category: "ai", 
      description: "Machine learning model for early detection of diseases from medical imaging with 95% accuracy.", 
      image: "https://placehold.co/600x400/7c3aed/white?text=AI+Project",
      features: ["Image classification", "Data visualization", "Cloud integration"],
      price: 499,
      status: "available"
    },
    { 
      id: 3, 
      title: "Blockchain Voting System", 
      category: "security", 
      description: "Secure and transparent voting platform using blockchain technology to ensure integrity and anonymity.", 
      image: "https://placehold.co/600x400/0ea5e9/white?text=Security+Project",
      features: ["End-to-end encryption", "Immutable records", "User verification"],
      price: 399,
      status: "available"
    },
    { 
      id: 4, 
      title: "Autonomous Robot Navigation", 
      category: "embedded", 
      description: "Embedded system for autonomous robot navigation in dynamic environments using sensor fusion.", 
      image: "https://placehold.co/600x400/10b981/white?text=Embedded+Project",
      features: ["SLAM algorithm", "Obstacle avoidance", "Path planning"],
      price: 599,
      status: "available"
    },
    { 
      id: 5, 
      title: "Cloud-Based E-Commerce Platform", 
      category: "software", 
      description: "Scalable e-commerce solution with payment gateway integration and admin dashboard.", 
      image: "https://placehold.co/600x400/f59e0b/white?text=Software+Project",
      features: ["Responsive design", "Payment integration", "Analytics dashboard"],
      price: 349,
      status: "available"
    },
    { 
      id: 6, 
      title: "VLSI Design for Neural Networks", 
      category: "vlsi", 
      description: "Custom ASIC design optimized for neural network computations with high performance and low power consumption.", 
      image: "https://placehold.co/600x400/ef4444/white?text=VLSI+Project",
      features: ["RTL implementation", "Power optimization", "FPGA verification"],
      price: 699,
      status: "available"
    }
  ];

  // Mock data for orders
  const mockOrders = [
    {
      id: "ORD-001",
      projectId: 2,
      projectName: "AI-Powered Medical Diagnosis",
      clientName: "Sarah Johnson",
      date: "2025-10-25",
      amount: 499,
      status: "delivered",
      deliveryDate: "2025-11-05"
    },
    {
      id: "ORD-002",
      projectId: 1,
      projectName: "Smart Home Automation System",
      clientName: "Michael Chen",
      date: "2025-10-28",
      amount: 299,
      status: "in-progress",
      expectedDelivery: "2025-11-20"
    },
    {
      id: "ORD-003",
      projectId: 3,
      projectName: "Blockchain Voting System",
      clientName: "Priya Sharma",
      date: "2025-11-01",
      amount: 399,
      status: "pending",
      expectedDelivery: "2025-11-25"
    }
  ];

  // Initialize data
  useEffect(() => {
    setProjects(mockProjects);
    setOrders(mockOrders);
  }, []);

  const categories = [
    { icon: <CircuitBoard className="w-8 h-8" />, name: "Hardware", description: "Complete hardware project solutions", id: "hardware" },
    { icon: <Smartphone className="w-8 h-8" />, name: "Software", description: "Custom software development", id: "software" },
    { icon: <Brain className="w-8 h-8" />, name: "AI/ML", description: "Machine learning & AI projects", id: "ai" },
    { icon: <Lock className="w-8 h-8" />, name: "Cybersecurity", description: "Security-focused solutions", id: "security" },
    { icon: <Network className="w-8 h-8" />, name: "VLSI", description: "Chip design & verification", id: "vlsi" },
    { icon: <Zap className="w-8 h-8" />, name: "Embedded", description: "Embedded systems projects", id: "embedded" },
    { icon: <Network className="w-8 h-8" />, name: "IoT", description: "Internet of Things solutions", id: "iot" },
  ];

  const features = [
    { icon: <TrendingUp className="w-6 h-6" />, title: "Industry Ready", description: "Projects designed to meet industry standards and requirements" },
    { icon: <Users className="w-6 h-6" />, title: "Expert Support", description: "Dedicated mentors and technical support throughout your project" },
    { icon: <Star className="w-6 h-6" />, title: "Quality Assured", description: "Every project undergoes rigorous testing and quality checks" },
    { icon: <CheckCircle className="w-6 h-6" />, title: "Documentation", description: "Comprehensive documentation and user guides included" },
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Computer Science Student", text: "The AI/ML project helped me secure my dream internship at a top tech company!" },
    { name: "Michael Chen", role: "Electronics Engineer", text: "Excellent hardware projects with detailed documentation and support." },
    { name: "Priya Sharma", role: "Cybersecurity Major", text: "The cybersecurity project was challenging yet perfectly executed." },
  ];

  // About Us data
  const stats = [
    { value: "500+", label: "Projects Completed" },
    { value: "250+", label: "Happy Students" },
    { value: "50+", label: "Industry Experts" },
    { value: "98%", label: "Success Rate" }
  ];

  const teamMembers = [
    { name: "Dr. Alex Morgan", role: "Founder & CEO", expertise: "AI/ML Specialist", image: "https://placehold.co/300x300/6366f1/white?text=AM" },
    { name: "Sarah Williams", role: "CTO", expertise: "Hardware Engineering", image: "https://placehold.co/300x300/8b5cf6/white?text=SW" },
    { name: "Raj Patel", role: "Head of Projects", expertise: "Embedded Systems", image: "https://placehold.co/300x300/ec4899/white?text=RP" },
    { name: "Emily Chen", role: "Lead Developer", expertise: "Full Stack Development", image: "https://placehold.co/300x300/06b6d4/white?text=EC" }
  ];

  // Contact info
  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: "Email", value: "contact@techsolutions.com" },
    { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+1 (555) 123-4567" },
    { icon: <MapPin className="w-5 h-5" />, label: "Address", value: "123 Tech Avenue, San Francisco, CA 94107" }
  ];

  // Social links
  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, name: "GitHub", url: "#" },
    { icon: <Linkedin className="w-5 h-5" />, name: "LinkedIn", url: "#" },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", url: "#" }
  ];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    if (contactFormRef.current) {
      contactFormRef.current.reset();
    }
  };

  // Authentication handlers
  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, this would authenticate with a backend
    // For demo, we'll use hardcoded credentials
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    if (email === 'admin@techsolutions.com' && password === 'admin123') {
      setAuthMode('admin');
    } else if (password === 'client123') {
      setAuthMode('client');
    } else {
      alert('Invalid credentials. Try:\nAdmin: admin@techsolutions.com / admin123\nClient: any email / client123');
    }
  };

  const handleLogout = () => {
    setAuthMode('guest');
  };

  const handlePurchase = (project) => {
    if (authMode === 'guest') {
      setAuthMode('login');
      setSelectedProject(project);
    } else if (authMode === 'client') {
      // Simulate purchase
      const newOrder = {
        id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        projectId: project.id,
        projectName: project.title,
        clientName: "Current User",
        date: new Date().toISOString().split('T')[0],
        amount: project.price,
        status: "pending",
        expectedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      setOrders([...orders, newOrder]);
      alert(`Project "${project.title}" has been purchased! Order ID: ${newOrder.id}`);
    }
  };

  const updateProjectStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? {...order, status: newStatus} : order
    ));
  };

  // Filter projects based on active tab
  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeTab);

  // Client Dashboard Component
  const ClientDashboard = () => {
    const clientOrders = orders.filter(order => order.clientName === "Current User");

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <CircuitBoard className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xl font-bold">Tech Solutions</span>
                <span className="text-purple-400 text-sm">- Client Dashboard</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Client User</span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">My Projects</h1>
            <p className="text-gray-300 mt-2">Track the status of your purchased projects</p>
          </div>

          {clientOrders.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
              <Package className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-300 mb-6">You haven't purchased any projects yet. Browse our solutions and find the perfect one for your needs.</p>
              <button 
                onClick={() => setAuthMode('guest')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Browse Projects
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {clientOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{order.projectName}</h3>
                      <p className="text-gray-300">Order ID: {order.id} | ${order.amount}</p>
                      <div className="flex items-center mt-2">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-gray-400 text-sm">Purchased: {order.date}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-900/50 text-green-400' :
                          order.status === 'in-progress' ? 'bg-blue-900/50 text-blue-400' :
                          'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {order.status === 'delivered' ? 'Delivered' : 
                           order.status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </span>
                        
                        {order.status === 'delivered' && (
                          <Check className="w-5 h-5 text-green-400 ml-2" />
                        )}
                        
                        {order.status === 'in-progress' && (
                          <Clock className="w-5 h-5 text-blue-400 ml-2" />
                        )}
                        
                        {order.status === 'pending' && (
                          <CreditCard className="w-5 h-5 text-yellow-400 ml-2" />
                        )}
                      </div>
                      
                      {order.status === 'in-progress' && order.expectedDelivery && (
                        <p className="text-gray-400 text-sm mt-1">Expected: {order.expectedDelivery}</p>
                      )}
                      
                      {order.status === 'delivered' && order.deliveryDate && (
                        <p className="text-gray-400 text-sm mt-1">Delivered: {order.deliveryDate}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                    <button className="text-sm bg-purple-900/30 text-purple-300 px-3 py-1 rounded hover:bg-purple-900/50 transition-colors">
                      Download Documentation
                    </button>
                    <button className="text-sm bg-purple-900/30 text-purple-300 px-3 py-1 rounded hover:bg-purple-900/50 transition-colors">
                      View Source Code
                    </button>
                    <button className="text-sm bg-purple-900/30 text-purple-300 px-3 py-1 rounded hover:bg-purple-900/50 transition-colors">
                      Contact Support
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Admin Dashboard Component
  const AdminDashboard = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <CircuitBoard className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xl font-bold">Tech Solutions</span>
                <span className="text-pink-400 text-sm">- Admin Dashboard</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Admin User</span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300 mt-2">Manage projects, orders, and client accounts</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-white/10">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Package className="w-6 h-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">Total Projects</p>
                  <p className="text-2xl font-bold text-white">{projects.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-white/10">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">Active Clients</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-white/10">
              <div className="flex items-center">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">Completed Orders</p>
                  <p className="text-2xl font-bold text-white">18</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-6 border border-white/10">
              <div className="flex items-center">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">Pending Orders</p>
                  <p className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'pending').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Management */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Order Management</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-gray-300 font-medium">Order ID</th>
                    <th className="px-6 py-3 text-gray-300 font-medium">Project</th>
                    <th className="px-6 py-3 text-gray-300 font-medium">Client</th>
                    <th className="px-6 py-3 text-gray-300 font-medium">Date</th>
                    <th className="px-6 py-3 text-gray-300 font-medium">Amount</th>
                    <th className="px-6 py-3 text-gray-300 font-medium">Status</th>
                    <th className="px-6 py-3 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4 text-white font-medium">{order.id}</td>
                      <td className="px-6 py-4 text-gray-300">{order.projectName}</td>
                      <td className="px-6 py-4 text-gray-300">{order.clientName}</td>
                      <td className="px-6 py-4 text-gray-400">{order.date}</td>
                      <td className="px-6 py-4 text-white">${order.amount}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.status}
                          onChange={(e) => updateProjectStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-900/50 text-green-400' :
                            order.status === 'in-progress' ? 'bg-blue-900/50 text-blue-400' :
                            'bg-yellow-900/50 text-yellow-400'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-sm bg-purple-900/30 text-purple-300 px-3 py-1 rounded hover:bg-purple-900/50 transition-colors">
                            View
                          </button>
                          <button className="text-sm bg-blue-900/30 text-blue-300 px-3 py-1 rounded hover:bg-blue-900/50 transition-colors">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Project Management */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Project Management</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="h-32 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                      <CircuitBoard className="w-12 h-12 text-purple-400" />
                    </div>
                    <h3 className="text-white font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">${project.price}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.status === 'available' ? 'bg-green-900/50 text-green-400' :
                        project.status === 'custom' ? 'bg-blue-900/50 text-blue-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {project.status}
                      </span>
                      
                      <div className="flex space-x-2">
                        <button className="text-sm bg-purple-900/30 text-purple-300 px-2 py-1 rounded hover:bg-purple-900/50 transition-colors">
                          Edit
                        </button>
                        <button className="text-sm bg-red-900/30 text-red-300 px-2 py-1 rounded hover:bg-red-900/50 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                  <PlusIcon />
                  <span className="ml-2">Add New Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Plus Icon Component
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  // Render different views based on auth mode
  if (authMode === 'client') {
    return <ClientDashboard />;
  }

  if (authMode === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <CircuitBoard className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xl font-bold">Tech Solutions</span>
              <span className="hidden md:inline text-gray-400 text-sm">- Your Problem Solver</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#projects" className="text-gray-300 hover:text-white transition-colors">Projects</a>
              <a href="#categories" className="text-gray-300 hover:text-white transition-colors">Categories</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <button 
                onClick={() => setAuthMode('login')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                Login
              </button>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black/40 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#home" className="block text-gray-300 hover:text-white">Home</a>
              <a href="#about" className="block text-gray-300 hover:text-white">About</a>
              <a href="#projects" className="block text-gray-300 hover:text-white">Projects</a>
              <a href="#categories" className="block text-gray-300 hover:text-white">Categories</a>
              <a href="#contact" className="block text-gray-300 hover:text-white">Contact</a>
              <button 
                onClick={() => setAuthMode('login')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center"
              >
                <User className="w-4 h-4 mr-1" />
                Login
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Tech Solutions
                <span className="block text-2xl md:text-3xl lg:text-4xl font-normal mt-2 text-gray-300">Your Problem Solver</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Premium hardware, software, and AI/ML solutions designed to help students and professionals 
                excel in their academic and career endeavors. Industry-ready projects with expert support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  Explore Solutions
                </button>
                <button 
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-purple-500 text-purple-300 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-500/20 transition-all"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {categories.slice(0, 4).map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10 flex flex-col items-center text-center"
                    >
                      <div className="text-purple-400 mb-2">{category.icon}</div>
                      <h3 className="text-white font-semibold">{category.name}</h3>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">About Tech Solutions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're a team of industry experts and academics dedicated to solving your technical challenges with innovative solutions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 mb-6">
                To empower students and professionals with cutting-edge technical solutions that enhance their skills and prepare them for real-world challenges. We believe in solving problems through innovation, and our projects are designed to provide hands-on experience with the latest technologies.
              </p>
              <p className="text-gray-300">
                Since our founding in 2020, we've helped over 250 students and professionals solve complex technical challenges and achieve their academic and career goals through our comprehensive project solutions and mentorship programs.
              </p>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-bold text-lg">Your Problem Solver</h4>
                    <p className="text-gray-300 mt-2">
                      At Tech Solutions, we don't just provide projects - we solve your specific technical challenges with customized solutions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 text-center border border-white/10"
                >
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-white text-center mb-12">Our Expert Team</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10"
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                    <p className="text-purple-400 mb-2">{member.role}</p>
                    <p className="text-gray-300 text-sm">{member.expertise}</p>
                    <div className="flex space-x-3 mt-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Featured Solutions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our portfolio of innovative solutions across various domains, each designed to solve specific technical challenges.
            </p>
          </motion.div>

          {/* Project Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'all' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              All Solutions
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === category.id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {categories.find(cat => cat.id === project.category)?.icon}
                    <span className="text-purple-400 text-sm font-medium">
                      {categories.find(cat => cat.id === project.category)?.name}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Problem Solved:</h4>
                    <ul className="space-y-1">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-white">${project.price}</span>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handlePurchase(project)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
              View All Solutions
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Solution Categories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our comprehensive collection of solutions across various cutting-edge technical domains
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-purple-400 mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-gray-300">{category.description}</p>
                <button className="mt-4 text-purple-400 hover:text-purple-300 font-medium flex items-center">
                  Explore Solutions <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Tech Solutions?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We provide more than just projects - we offer complete solutions with exceptional support and quality
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear from students and professionals who solved their technical challenges with our solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-purple-300 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Contact Tech Solutions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have a technical challenge? Let our experts help you find the perfect solution.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mt-1 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                        <div className="text-purple-400">{info.icon}</div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-white font-medium">{info.label}</h4>
                        <p className="text-gray-300">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h4 className="text-white font-medium mb-4">Response Time</h4>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-green-400 mr-2" />
                      <span>Within 24 hours on business days</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-purple-400 mr-2" />
                      <span>All inquiries are confidential</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-white font-medium mb-4">Follow Our Solutions</h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <a 
                        key={index} 
                        href={social.url} 
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Describe Your Challenge</h3>
              <form ref={contactFormRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Challenge Category</label>
                  <select
                    id="subject"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    <option value="hardware">Hardware Challenge</option>
                    <option value="software">Software Development</option>
                    <option value="ai-ml">AI/ML Problem</option>
                    <option value="security">Security Concern</option>
                    <option value="embedded">Embedded Systems</option>
                    <option value="iot">IoT Integration</option>
                    <option value="other">Other Technical Challenge</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Describe Your Technical Challenge</label>
                  <textarea
                    id="message"
                    rows="5"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Please describe the technical challenge you're facing..."
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    required
                    className="rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500"
                  />
                  <label htmlFor="consent" className="ml-2 text-sm text-gray-300">
                    I agree to the <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Challenge Details
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <CircuitBoard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-white text-xl font-bold">Tech Solutions</span>
                  <div className="text-purple-400 text-sm">Your Problem Solver</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Solving complex technical challenges with innovative, industry-ready solutions for students and professionals.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url} 
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#categories" className="text-gray-400 hover:text-white transition-colors">Categories</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Solution Areas</h3>
              <ul className="space-y-2">
                {categories.slice(0, 4).map((category, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Subscribe to get the latest technical solutions and resources.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
                />
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-r-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Tech Solutions - Your Problem Solver. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Authentication Modals */}
      <AnimatePresence>
        {authMode === 'login' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setAuthMode('guest')}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Tech Solutions</h2>
                <p className="text-gray-400">Sign in to access your projects and solutions</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    defaultValue="client@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your password"
                      defaultValue="client123"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-gray-300">
                    <input type="checkbox" className="rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500" />
                    <span className="ml-2">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-purple-400 hover:text-purple-300">Forgot password?</a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don't have an account? 
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-purple-400 hover:text-purple-300 font-medium ml-1"
                  >
                    Create account
                  </button>
                </p>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-500 mb-2">Admin access?</p>
                  <button 
                    onClick={() => {
                      document.querySelector('input[name="email"]').value = 'admin@techsolutions.com';
                      document.querySelector('input[name="password"]').value = 'admin123';
                    }}
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center mx-auto"
                  >
                    <Key className="w-4 h-4 mr-1" />
                    Use admin credentials
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {authMode === 'signup' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setAuthMode('guest')}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400">Join Tech Solutions to access premium projects</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required
                    className="rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500 mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                    I agree to the <a href="#" className="text-purple-400 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account? 
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-purple-400 hover:text-purple-300 font-medium ml-1"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
