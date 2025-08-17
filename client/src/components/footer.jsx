import { Link } from "react-router-dom";

const Footer = ()=>{
  return (
    <footer className="bg-[rgba(30,41,59,0.8)] border-t border-[rgba(255,255,255,0.1)] py-12 px-8 text-center">
      <div className="max-w-7xl mx-auto">
        
        {/* Footer Links */}
        <div className="flex justify-center gap-8 mb-8 flex-wrap">
          <Link to="/about" className="text-[rgba(255,255,255,0.7)] hover:text-[#667eea] transition-colors duration-300">
            About
          </Link>
          <Link to="/contact" className="text-[rgba(255,255,255,0.7)] hover:text-[#667eea] transition-colors duration-300">
            Contact
          </Link>
          <Link to="/privacy" className="text-[rgba(255,255,255,0.7)] hover:text-[#667eea] transition-colors duration-300">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-[rgba(255,255,255,0.7)] hover:text-[#667eea] transition-colors duration-300">
            Terms of Service
          </Link>
          <Link to="/github" className="text-[rgba(255,255,255,0.7)] hover:text-[#667eea] transition-colors duration-300">
            GitHub
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-8">
          <Link to="#" className="w-10 h-10 bg-[rgba(255,255,255,0.1)] rounded-lg flex items-center justify-center text-[rgba(255,255,255,0.7)] hover:bg-gradient-to-br hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:-translate-y-0.5 transition-all duration-300">
            📧
          </Link>
          <Link to="#" className="w-10 h-10 bg-[rgba(255,255,255,0.1)] rounded-lg flex items-center justify-center text-[rgba(255,255,255,0.7)] hover:bg-gradient-to-br hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:-translate-y-0.5 transition-all duration-300">
            🐦
          </Link>
          <Link to="#" className="w-10 h-10 bg-[rgba(255,255,255,0.1)] rounded-lg flex items-center justify-center text-[rgba(255,255,255,0.7)] hover:bg-gradient-to-br hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:-translate-y-0.5 transition-all duration-300">
            📱
          </Link>
          <Link to="#" className="w-10 h-10 bg-[rgba(255,255,255,0.1)] rounded-lg flex items-center justify-center text-[rgba(255,255,255,0.7)] hover:bg-gradient-to-br hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:-translate-y-0.5 transition-all duration-300">
            💼
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-[rgba(255,255,255,0.5)] text-sm">
          © 2024 PeerLink. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


export default Footer;
