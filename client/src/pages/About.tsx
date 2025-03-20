import jsPDF from 'jspdf';
import { useEffect } from 'react';


const About = () => {
    useEffect(() => {
        // Create a new instance of jsPDF
        const pdf = new jsPDF();
    
        // Add HTML content to the PDF
        pdf.html('<div style="color:#000;">hi</div>', {
          callback: function (pdf) {
            // Save the PDF
            pdf.save('my-pdf.pdf');
          }
        });
      }, []);
  return (
    <div>About</div>
  )
}

export default About