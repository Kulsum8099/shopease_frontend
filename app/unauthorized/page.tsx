export default function UnauthorizedPage() {
    return (
        <div className="h-screen flex items-center justify-center text-center">
            <div>
                <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600">You don’t have permission to access this page.</p>
            </div>
        </div>
    )
}
