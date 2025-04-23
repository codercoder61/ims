import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

function Report() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date1 = queryParams.get('date1'); // Get `id` from query string
    const date2 = queryParams.get('date2'); // Get `id` from query string
    const [data, setData] = useState(null);
    const generatePDF = () => {
        const element = document.getElementById("content");
        const options = {
          filename: "report.pdf",
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 4 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(options).save();
      };
      useEffect(() => {
        const data2 = {
            date1: date1, // Example start date
            date2: date2, // Example end date
        };
    
        fetch('http://soc-net.info/api/getSalesByDates.php' ,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data2), // Send the data as JSON
        })
        .then((response) => {
            // Check if the response is okay
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            return response.json(); // This will fail if the response is not valid JSON
        })
        .then((data) => {
            console.log(data);
            setData(data); // Store data from the API
            
        })
        .catch((error) => {
            // Handle errors (invalid JSON, network issues, etc.)
            console.error('Error:', error);
        });
    }, []); // Empty array ensures this only runs once (componentDidMount)
    
  return (
    <>
    <div id="content" style={{textAlign:'center'}}>
      <table>
        <tr style={{textAlign:'center'}}>
            <td style={{textAlign:'center',fontWeight:'bold'}}>Inventory Management System - Sales Report</td>
        </tr>
        <tr>
            <td style={{textAlign:'center',fontWeight:'bold'}}>{date2} till {date1}</td>
        </tr>
      </table>
      <table>
        <thead>
        <tr>
            <td>Date</td>
            <td>Product Title</td>
            <td>Buying Price</td>
            <td>Selling Price</td>
            <td>Total Qty</td>
            <td>Total</td>
        </tr>
        </thead>
        <tbody>
            {data && data.products && data.products != [] && data.products.map((sale,index)=> {
                return (
                    <>
                        <tr key={index}>
                            <td>{sale.date}</td>
                            <td>{sale.name}</td>
                            <td>{sale.buying_price} DH</td>
                            <td>{sale.selling_price} DH</td>
                            <td>{sale.qty}</td>
                            <td>{sale.selling_price*sale.qty} DH</td>
                        </tr>
                    </>
            )})
            }
            <tr>
                <td colSpan="4"></td>
                <td>Grand Total</td>
                <td>{data && data.grandTotal} DH</td>
            </tr>
            <tr>
                <td colSpan="4"></td>
                <td>Profit</td>
                <td>{data && (data.grandTotal - data.selling)} DH</td>
            </tr>

        </tbody>
      </table>

    </div>
          <button onClick={generatePDF} style={{marginTop:'20px'}}>Generate PDF</button>
</>
  )
}

export default Report
