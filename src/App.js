import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    location: "",
    headline: "",
    currentCompanyName: "",
    currentPosition: "",
    projectId: "", 
    referenceId: "",
    externalId: "",
    portfolio: "",
    github: "",
    description: "",
    referent: "",
    personalMessage: "",
  });
  const [cvFile, setCvFile] = useState(null);
  const [message, setMessage] = useState("");

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setCvFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let resumesFiles = [];
    if (cvFile) {
      const base64 = await toBase64(cvFile);
      resumesFiles.push({
        fileName: cvFile.name,
        data: base64,
      });
    }

    const payload = {
      ...form,
      emailAddresses: form.email,
      phoneNumbers: form.phone,
      resumesFiles,
    };

    const apiKey = process.env.REACT_APP_JARVI_API_KEY;
    if (!apiKey) {
      setMessage("Erreur : Clé API manquante. Veuillez configurer la variable d'environnement REACT_APP_JARVI_API_KEY");
      return;
    }

    const options = {
      method: 'POST',
      headers: {'X-API-KEY': apiKey, 'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch('https://functions.prod.jarvi.tech/v1/public-api/rest/v2/applicants', options);
      
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setMessage("Candidature envoyée avec succès !");
      } else {
        const errorText = await response.text();
        console.error('Erreur HTTP:', response.status, errorText);
        
        if (response.status === 401) {
          setMessage("Erreur d'autorisation : Clé API invalide ou expirée. Veuillez vérifier votre clé API.");
        } else if (response.status === 403) {
          setMessage("Erreur d'autorisation : Accès refusé. Votre clé API n'a pas les permissions nécessaires.");
        } else if (response.status === 400) {
          setMessage("Erreur de données : Vérifiez que tous les champs requis sont correctement remplis.");
        } else {
          setMessage(`Erreur lors de l'envoi (${response.status}): ${errorText || 'Erreur serveur'}`);
        }
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setMessage("Erreur lors de l'envoi : " + error.message);
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1 className="form-title">Candidature</h1>
        <p className="form-subtitle">Remplissez le formulaire ci-dessous pour postuler</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input 
              name="firstName" 
              placeholder="Prénom" 
              onChange={handleChange} 
              required 
              type="text"
            />
            <input 
              name="lastName" 
              placeholder="Nom" 
              onChange={handleChange} 
              required 
              type="text"
            />
          </div>
          
          <div className="form-row">
            <input 
              name="email" 
              placeholder="Email" 
              onChange={handleChange} 
              required 
              type="email"
            />
            <input 
              name="phone" 
              placeholder="Téléphone" 
              onChange={handleChange} 
              type="tel"
            />
          </div>
          
          <input 
            name="linkedinUrl" 
            placeholder="Profil LinkedIn" 
            onChange={handleChange} 
            type="url"
          />
          
          <div className="form-row">
            <input 
              name="portfolio" 
              placeholder="Portfolio (URL)" 
              onChange={handleChange} 
              type="url"
            />
            <input 
              name="github" 
              placeholder="Profil GitHub" 
              onChange={handleChange} 
              type="url"
            />
          </div>
          
          <div className="form-row">
            <input 
              name="location" 
              placeholder="Localisation" 
              onChange={handleChange} 
              type="text"
            />
            <input 
              name="headline" 
              placeholder="Titre professionnel" 
              onChange={handleChange} 
              type="text"
            />
          </div>
          
          <div className="form-row">
            <input 
              name="currentCompanyName" 
              placeholder="Entreprise actuelle" 
              onChange={handleChange} 
              type="text"
            />
            <input 
              name="currentPosition" 
              placeholder="Poste actuel" 
              onChange={handleChange} 
              type="text"
            />
          </div>
          
          <input 
            name="projectId" 
            placeholder="Project ID Jarvi *" 
            onChange={handleChange} 
            required 
            type="text"
          />
          
          <textarea 
            name="description" 
            placeholder="Décrivez votre profil, vos compétences et vos motivations..." 
            onChange={handleChange} 
            rows="4"
            className="textarea-field"
          />
          
          <div className="form-row">
            <input 
              name="referenceId" 
              placeholder="Reference ID" 
              onChange={handleChange} 
              type="text"
            />
            <input 
              name="externalId" 
              placeholder="External ID" 
              onChange={handleChange} 
              type="text"
            />
          </div>
          
          <input 
            name="referent" 
            placeholder="Référent (noms des personnes qui vous a recommandé)" 
            onChange={handleChange} 
            type="text"
          />
          
          <textarea 
            name="personalMessage" 
            placeholder="Message personnel" 
            onChange={handleChange} 
            rows="4"
            className="textarea-field"
          />
          
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileChange} 
          />
          {cvFile && (
            <div className="file-info">
              Fichier sélectionné: {cvFile.name}
            </div>
          )}
          
          <button type="submit">Envoyer ma candidature</button>
          
          {message && (
            <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default App;
