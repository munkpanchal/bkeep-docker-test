const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="public-route">
            <div className="public-route-wrapper">{children}</div>
        </main>
    );
};

export default PublicLayout;
