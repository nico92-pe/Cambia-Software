import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Save, Eye, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const ClientsComponent = () => {
  const [salesmen, setSalesmen] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [error, setError] = useState(null);
  const [ruc, setRuc] = useState('');
  const [fullName, setFullName] = useState('');
  const [shortName, setShortName] = useState('');
  const [contact1, setContact1] = useState('');
  const [phone1, setPhone1] = useState('');
  const [contact2, setContact2] = useState('');
  const [phone2, setPhone2] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [department, setDepartment] = useState('');
  const [reference, setReference] = useState('');
  const [transportAgency, setTransportAgency] = useState('');
  const [transportAddress, setTransportAddress] = useState('');
  const [transportDistrict, setTransportDistrict] = useState('');
  const [transportReference, setTransportReference] = useState('');

  const [activeSection, setActiveSection] = useState(null);
  const [showTransportSection, setShowTransportSection] = useState(false);
  const focusedInputRef = useRef(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchSalesmen();
    fetchClients();
  }, []);

  const fetchSalesmen = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/salesmen`);
      if (!response.ok) {
        throw new Error('Failed to fetch salesmen');
      }
      const data = await response.json();
      setSalesmen(data);
    } catch (error) {
      console.error('Error fetching salesmen:', error);
      setError('Failed to load salesmen. Please try again later.');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`);
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to load clients. Please try again later.');
    }
  };

  useEffect(() => {
    if (focusedInputRef.current) {
      const input = document.querySelector(`input[name="${focusedInputRef.current}"]`);
      if (input) {
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
      }
    }
  });

  const handleSaveClient = async () => {
    try {
      const clientData = {
        ruc,
        fullName,
        shortName,
        contact1,
        phone1,
        contact2,
        phone2,
        address,
        district,
        province,
        department,
        reference,
        transportAgency,
        transportAddress,
        transportDistrict,
        transportReference,
        assignedSalesman: selectedSalesman
      };

      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Failed to save client');
      }

      const savedClient = await response.json();
      console.log('Client saved successfully:', savedClient);
      
      fetchClients();
      
      // Clear the form
      setRuc('');
      setFullName('');
      setShortName('');
      setContact1('');
      setPhone1('');
      setContact2('');
      setPhone2('');
      setAddress('');
      setDistrict('');
      setProvince('');
      setDepartment('');
      setReference('');
      setTransportAgency('');
      setTransportAddress('');
      setTransportDistrict('');
      setTransportReference('');
      setSelectedSalesman('');
      setShowTransportSection(false);
      
    } catch (error) {
      console.error('Error saving client:', error);
      setError('Failed to save client. Please try again.');
    }
  };

  const toggleSection = (sectionName) => {
    setActiveSection(prevSection => prevSection === sectionName ? null : sectionName);
  };

  const handleDepartmentBlur = () => {
    setShowTransportSection(department && department.toLowerCase() !== 'lima');
  };

  const Section = ({ title, name, children }) => {
    const isOpen = activeSection === name;
    return (
      <div className="mb-6">
        <h3 
          className="text-lg font-semibold mb-3 flex items-center cursor-pointer"
          onClick={() => toggleSection(name)}
        >
          {isOpen ? <ChevronDown size={24} className="mr-2" /> : <ChevronRight size={24} className="mr-2" />}
          {title}
        </h3>
        {isOpen && (
          <div className="grid grid-cols-2 gap-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  const InputField = ({ label, value, onChange, onBlur, type = "text", name }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={() => { focusedInputRef.current = name; }}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const ClientModal = ({ client, onClose }) => {
    if (!client) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{client.shortName}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={28} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>RUC:</strong> {client.ruc}</p>
            <p><strong>Full Name:</strong> {client.fullName}</p>
            <p><strong>Contact 1:</strong> {client.contact1}</p>
            <p><strong>Phone 1:</strong> {client.phone1}</p>
            <p><strong>Contact 2:</strong> {client.contact2}</p>
            <p><strong>Phone 2:</strong> {client.phone2}</p>
            <p><strong>Address:</strong> {client.address}</p>
            <p><strong>District:</strong> {client.district}</p>
            <p><strong>Province:</strong> {client.province}</p>
            <p><strong>Department:</strong> {client.department}</p>
            <p><strong>Reference:</strong> {client.reference}</p>
            {client.transportAgency && (
              <>
                <p><strong>Transport Agency:</strong> {client.transportAgency}</p>
                <p><strong>Transport Address:</strong> {client.transportAddress}</p>
                <p><strong>Transport District:</strong> {client.transportDistrict}</p>
                <p><strong>Transport Reference:</strong> {client.transportReference}</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ClientList = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Client List</h2>
      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {clients.map((client) => (
            <div key={client._id} className="flex items-center justify-between p-3 bg-gray-100 rounded">
              <span className="font-medium">{client.shortName}</span>
              <button
                onClick={() => setSelectedClient(client)}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Eye size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Clients Management</h1>
      
      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Add New Client</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Salesman</label>
            <select
              value={selectedSalesman}
              onChange={(e) => setSelectedSalesman(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Salesman</option>
              {salesmen.map((salesman) => (
                <option key={salesman._id} value={salesman._id}>
                  {salesman.name}
                </option>
              ))}
            </select>
          </div>

          <Section title="Client Data" name="clientData">
            <InputField label="RUC" value={ruc} onChange={(e) => setRuc(e.target.value)} name="ruc" />
            <InputField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} name="fullName" />
            <InputField label="Short Name" value={shortName} onChange={(e) => setShortName(e.target.value)} name="shortName" />
          </Section>

          <Section title="Contact Info" name="contactInfo">
            <InputField label="Contact 1" value={contact1} onChange={(e) => setContact1(e.target.value)} name="contact1" />
            <InputField label="Phone 1" value={phone1} onChange={(e) => setPhone1(e.target.value)} type="tel" name="phone1" />
            <InputField label="Contact 2" value={contact2} onChange={(e) => setContact2(e.target.value)} name="contact2" />
            <InputField label="Phone 2" value={phone2} onChange={(e) => setPhone2(e.target.value)} type="tel" name="phone2" />
          </Section>

          <Section title="Address" name="address">
            <InputField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} name="address" />
            <InputField 
              label="Department" 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)} 
              onBlur={handleDepartmentBlur}
              name="department" 
            />
            <InputField label="Province" value={province} onChange={(e) => setProvince(e.target.value)} name="province" />
            <InputField label="District" value={district} onChange={(e) => setDistrict(e.target.value)} name="district" />
            <InputField label="Reference" value={reference} onChange={(e) => setReference(e.target.value)} name="reference" />
          </Section>

          {showTransportSection && (
            <Section title="Transport Company" name="transportCompany">
              <InputField label="Transport Agency" value={transportAgency} onChange={(e) => setTransportAgency(e.target.value)} name="transportAgency" />
              <InputField label="Address" value={transportAddress} onChange={(e) => setTransportAddress(e.target.value)} name="transportAddress" />
              <InputField label="District" value={transportDistrict} onChange={(e) => setTransportDistrict(e.target.value)} name="transportDistrict" />
              <InputField label="Reference" value={transportReference} onChange={(e) => setTransportReference(e.target.value)} name="transportReference" />
            </Section>
          )}

          <button
            onClick={handleSaveClient}
            className="mt-6 w-full p-3 bg-green-500 text-white rounded text-lg font-semibold hover:bg-green-600 flex items-center justify-center"
          >
            <Save size={24} className="mr-2" /> Save Client
          </button>
        </div>

        <div>
          <ClientList />
        </div>
      </div>
      
      {selectedClient && (
        <ClientModal 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}
    </div>
  );
};

export default ClientsComponent;