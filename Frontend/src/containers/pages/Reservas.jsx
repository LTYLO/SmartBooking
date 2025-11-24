import Footer from "components/navigation/Footer"
import Navbar from "components/navigation/Navbar"
import Layout from "hocs/layouts/layout"
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Plus, X, AlertCircle, Check } from 'lucide-react';
import { useAuth } from 'components/AuthContext';
import Reservas from "components/Reservas"

// [COPIA TODO EL CÓDIGO DEL ARTIFACT AQUÍ, excepto el export default final]

function ReservasPage() {
  return (
    <Layout>
      <Navbar/>
      <Reservas/>
      <Footer/>
    </Layout>
  );
}

export default ReservasPage;