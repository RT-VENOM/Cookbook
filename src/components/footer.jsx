export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 py-12">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Community</li>
            <li>Help Center</li>
            <li>API</li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-2">
          <h4 className="font-bold mb-4">Subscribe to our newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">Weekly techniques delivered to your inbox.</p>
        </div>
      </div>
    </footer>
  );
}