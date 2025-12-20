import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { WishlistProvider } from "./context/WishlistContext";
import Layout from "./components/Layout";
import Loading from "./components/Loading";
import { Suspense, lazy } from "react";
import AdminRoute from "./components/AdminRoute";

// Lazy load pages
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Home = lazy(() => import("./pages/Home/Home"));
const ProductDetails = lazy(() => import("./pages/Product/ProductDetails"));
const QRView = lazy(() => import("./pages/Orders/QRView"));
const ScanPage = lazy(() => import("./pages/Orders/ScanPage"));
const Settings = lazy(() => import("./pages/User/Settings"));
const MyOrders = lazy(() => import("./pages/Orders/MyOrders"));
const PaymentPage = lazy(() => import("./pages/Orders/PaymentPage"));
const OrderSuccess = lazy(() => import("./pages/Orders/OrderSuccess"));
const Wishlist = lazy(() => import("./pages/User/Wishlist"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));

// Support Pages
const Delivery = lazy(() => import("./pages/Support/Delivery"));
const About = lazy(() => import("./pages/Support/About"));
const Contact = lazy(() => import("./pages/Support/Contact"));
const Help = lazy(() => import("./pages/Support/Help"));
const NotFound = lazy(() => import("./pages/Support/NotFound"));

// Legal Pages
const PrivacyPolicy = lazy(() => import("./pages/Legal/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Legal/Terms"));
const Returns = lazy(() => import("./pages/Legal/Returns"));



const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return <Loading />;
    if (!user) return <Navigate to="/login" />;
    return <>{children}</>;
};

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <CartProvider>
                    <WishlistProvider>
                        <Router>
                            <Suspense fallback={<Loading />}>
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />

                                    {/* Protected Routes wrapped in Layout */}
                                    <Route element={<Layout />}>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/product/:id" element={<ProductDetails />} />

                                        <Route
                                            path="/order/:id/qr"
                                            element={
                                                <ProtectedRoute>
                                                    <QRView />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/orders"
                                            element={
                                                <ProtectedRoute>
                                                    <MyOrders />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/order-success"
                                            element={
                                                <ProtectedRoute>
                                                    <OrderSuccess />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/wishlist"
                                            element={
                                                <ProtectedRoute>
                                                    <Wishlist />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/settings"
                                            element={
                                                <ProtectedRoute>
                                                    <Settings />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/admin"
                                            element={
                                                <AdminRoute>
                                                    <AdminDashboard />
                                                </AdminRoute>
                                            }
                                        />

                                        {/* Public Pages wrapped in Layout */}
                                        <Route path="/delivery" element={<Delivery />} />
                                        <Route path="/about" element={<About />} />
                                        <Route path="/contact" element={<Contact />} />
                                        <Route path="/help" element={<Help />} />
                                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                        <Route path="/terms" element={<Terms />} />
                                        <Route path="/returns" element={<Returns />} />
                                    </Route>

                                    {/* Public Route for Scanning */}
                                    <Route path="/api/orders/:id/scan" element={<ScanPage />} />
                                    {/* Public Route for Secure Token Payment */}
                                    <Route path="/pay/:token" element={<PaymentPage />} />

                                    {/* 404 Not Found */}
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Suspense>
                        </Router>
                    </WishlistProvider>
                </CartProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
