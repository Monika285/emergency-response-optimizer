'use client';

import { useRef } from 'react';
import { Hospital } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Download, X, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReservationReceiptProps {
  reservation: {
    id: string;
    hospital: Hospital;
    careType: string;
    bedCount: number;
    patientName: string;
    contactNumber: string;
    notes: string;
    timestamp: string;
    status: string;
  };
  onClose: () => void;
}

export function ReservationReceipt({ reservation, onClose }: ReservationReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`bed-reservation-${reservation.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const downloadImage = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `bed-reservation-${reservation.id}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[hsl(var(--status-stable))]" />
            Reservation Confirmed
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="p-8 bg-gradient-to-br from-background to-card/50">
          <div className="text-center mb-8 pb-6 border-b border-border">
            <div className="text-4xl font-bold text-primary mb-2">Golden 10</div>
            <p className="text-sm text-muted-foreground">Emergency Response Optimizer</p>
            <p className="text-xs text-muted-foreground mt-1">Bed Reservation Receipt</p>
          </div>

          {/* Reservation ID */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-1">RESERVATION ID</p>
            <p className="text-xl font-mono font-bold text-primary">{reservation.id}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatDate(reservation.timestamp)}</p>
          </div>

          {/* Hospital Details */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 text-lg">Hospital Details</h3>
            <div className="bg-muted/20 border border-border rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Hospital Name</p>
                <p className="font-semibold text-foreground text-lg">{reservation.hospital.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-foreground">{reservation.hospital.address}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="text-foreground font-mono">{reservation.hospital.phone}</p>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 text-lg">Reservation Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/20 border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Care Type</p>
                <p className="font-semibold text-foreground text-lg">{reservation.careType}</p>
              </div>
              <div className="bg-muted/20 border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Beds Reserved</p>
                <p className="font-semibold text-primary text-lg">{reservation.bedCount}</p>
              </div>
              <div className="bg-muted/20 border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Patient Name</p>
                <p className="font-semibold text-foreground text-lg">{reservation.patientName}</p>
              </div>
              <div className="bg-muted/20 border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Contact</p>
                <p className="font-semibold text-foreground text-lg font-mono">{reservation.contactNumber}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {reservation.notes && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3 text-lg">Additional Notes</h3>
              <div className="bg-muted/20 border border-border rounded-lg p-4">
                <p className="text-foreground">{reservation.notes}</p>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="mb-6">
            <div className="bg-[hsl(var(--status-stable))]/10 border border-[hsl(var(--status-stable))]/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[hsl(var(--status-stable))]" />
                <div>
                  <p className="font-semibold text-[hsl(var(--status-stable))]">Status: Confirmed</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please present this receipt at the hospital reception desk
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground pt-6 border-t border-border">
            <p>Golden 10 - Emergency Response Optimizer</p>
            <p className="mt-1">This receipt is valid for 24 hours from issuance</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
          <Button
            variant="outline"
            onClick={downloadImage}
            className="flex-1 border-border gap-2"
          >
            <Download className="w-4 h-4" />
            Download Image
          </Button>
          <Button
            onClick={downloadPDF}
            className="flex-1 bg-primary hover:bg-primary/90 gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
