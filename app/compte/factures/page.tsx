'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/app/contexte/AuthContext';
import { api } from '@/app/lib/api';
import {
  FileText,
  CheckCircle2,
  Clock,
  Download,
  MoreVertical,
  Eye,
  Printer,
  X,
  Loader2,
} from 'lucide-react';

type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled';

interface BookingRef {
  id: string;
  reference: string;
  propertyId: string;
  guestName: string;
}

interface InvoiceApi {
  id: string;
  invoiceNumber: string;
  amount: number | string;
  taxAmount: number | string;
  totalAmount: number | string;
  status: InvoiceStatus;
  issuedAt: string | null;
  paidAt: string | null;
  bookingId: string;
  booking?: BookingRef;
}

interface PropertyApi {
  id: string;
  name: string;
}

function extractArray<T>(payload: any): T[] {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function FacturesPage() {
  const { isLoading: authLoading } = useAuth();

  const [invoices, setInvoices] = useState<InvoiceApi[]>([]);
  const [properties, setProperties] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceApi | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    Promise.all([
      api.get('/invoices', { params: { limit: 100 } }),
      api.get('/properties', { params: { limit: 200 } }),
    ])
      .then(([invoicesRes, propertiesRes]) => {
        if (cancelled) return;

        setInvoices(extractArray<InvoiceApi>(invoicesRes.data));

        const propertyList = extractArray<PropertyApi>(propertiesRes.data);
        const map: Record<string, string> = {};
        propertyList.forEach((p) => {
          map[p.id] = p.name;
        });
        setProperties(map);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Impossible de récupérer vos factures.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const reservationLabel = (invoice: InvoiceApi): string => {
    const booking = invoice.booking;
    if (!booking) return 'Réservation';
    return properties[booking.propertyId] ?? booking.reference ?? 'Réservation';
  };

  // Pas de generation reelle de PDF cote backend (Invoice.pdfUrl n'est
  // jamais rempli actuellement) : on genere un recu texte cote client,
  // meme logique que la page Reservations.
  const handleDownloadReceipt = (invoice: InvoiceApi) => {
    const content = `================================================
RÉSIDENCE ÉMERAUDE - FACTURE
================================================
N° Facture : ${invoice.invoiceNumber}
Réservation : ${reservationLabel(invoice)}
Date d'émission : ${formatDate(invoice.issuedAt)}
Montant HT : ${formatCurrency(Number(invoice.amount))}
Taxes : ${formatCurrency(Number(invoice.taxAmount))}
Montant Total : ${formatCurrency(Number(invoice.totalAmount))}
Statut : ${invoice.status.toUpperCase()}
================================================
Merci pour votre confiance !`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Facture_${invoice.invoiceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setActiveMenuId(null);
  };

  const handlePrint = (invoice: InvoiceApi) => {
    setSelectedInvoice(invoice);
    setTimeout(() => window.print(), 200);
    setActiveMenuId(null);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Payée
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          Annulée
        </span>
      );
    }
    // draft / issued : pas encore payee
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
        En attente
      </span>
    );
  };

  const totalAmount = useMemo(() => invoices.reduce((acc, inv) => acc + Number(inv.totalAmount), 0), [invoices]);
  const paidInvoices = useMemo(() => invoices.filter((i) => i.status === 'paid'), [invoices]);
  const paidAmount = useMemo(() => paidInvoices.reduce((acc, inv) => acc + Number(inv.totalAmount), 0), [paidInvoices]);
  const pendingInvoices = useMemo(() => invoices.filter((i) => i.status === 'draft' || i.status === 'issued'), [invoices]);
  const pendingAmount = useMemo(
    () => pendingInvoices.reduce((acc, inv) => acc + Number(inv.totalAmount), 0),
    [pendingInvoices],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#0F2F28]" />
        <span>Chargement de vos factures...</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 text-slate-800 relative min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#0F2F28]">Mes factures</h1>
        <p className="text-slate-500 text-sm mt-1">Consultez et téléchargez toutes vos factures.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
      )}

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0F2F28]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total facturé</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{formatCurrency(totalAmount)}</div>
            <div className="text-xs text-slate-400 mt-0.5">Sur {invoices.length} factures</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Payé</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{formatCurrency(paidAmount)}</div>
            <div className="text-xs text-emerald-600 mt-0.5 font-medium">{paidInvoices.length} factures</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">En attente</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{formatCurrency(pendingAmount)}</div>
            <div className="text-xs text-amber-600 mt-0.5 font-medium">{pendingInvoices.length} factures</div>
          </div>
        </div>
      </div>

      {/* Tableau des factures */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase font-medium">
              <tr>
                <th className="py-4 px-6">N° facture</th>
                <th className="py-4 px-6">Réservation</th>
                <th className="py-4 px-6">Date d'émission</th>
                <th className="py-4 px-6">Montant</th>
                <th className="py-4 px-6">Statut</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                    Aucune facture disponible.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">{invoice.invoiceNumber}</td>
                    <td className="py-4 px-6 text-slate-700">{reservationLabel(invoice)}</td>
                    <td className="py-4 px-6 text-slate-500">{formatDate(invoice.issuedAt)}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatCurrency(Number(invoice.totalAmount))}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(invoice.status)}</td>
                    <td className="py-4 px-6 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownloadReceipt(invoice)}
                          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Reçu</span>
                        </button>

                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === invoice.id ? null : invoice.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === invoice.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 text-left text-xs"
                            >
                              <button
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>Voir le détail</span>
                              </button>
                              <button
                                onClick={() => handleDownloadReceipt(invoice)}
                                className="w-full px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-400" />
                                <span>Télécharger le reçu</span>
                              </button>
                              <button
                                onClick={() => handlePrint(invoice)}
                                className="w-full px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-400" />
                                <span>Imprimer</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale d'Aperçu */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-xl font-serif font-bold text-[#0F2F28]">Résidence Émeraude</h3>
              <p className="text-xs text-slate-400">Facture Officielle</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Numéro :</span>
                <span className="font-bold text-slate-900">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date d'émission :</span>
                <span className="text-slate-800">{formatDate(selectedInvoice.issuedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service :</span>
                <span className="font-medium text-slate-800">{reservationLabel(selectedInvoice)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">Statut :</span>
                {getStatusBadge(selectedInvoice.status)}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center mt-4">
                <span className="font-bold text-slate-700">Total</span>
                <span className="text-lg font-bold text-[#0F2F28]">
                  {formatCurrency(Number(selectedInvoice.totalAmount))}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => handleDownloadReceipt(selectedInvoice)}
                className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Reçu</span>
              </button>
              <button
                onClick={() => handlePrint(selectedInvoice)}
                className="flex-1 bg-[#0F2F28] text-white py-2 rounded-xl text-xs font-medium hover:bg-[#153e35] transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}