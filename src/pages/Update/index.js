import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from "react-router-dom";
import api from '../../services/api';

import camera from '../../assets/camera.svg';
import './styles.css';

export default function Update({ history }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [company, setCompany] = useState('');
  const [techs, setTechs] = useState('');
  const [price, setPrice] = useState('');

  const { spotId } = useParams();

  useEffect(() => {
    (async function loadSpot() {
      const response = await api.get(`/spots/${spotId}`);
      const { spot } = response.data;

      setCompany(spot.company);
      setTechs(spot.techs.join(', '));
      setPrice(spot.price ? spot.price : 0);
    })();
  }, [spotId]);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null
  }, [thumbnail]);
  
  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    const user_id = localStorage.getItem('user');

    console.log(user_id);

    data.append('thumbnail', thumbnail);
    data.append('company', company);
    data.append('techs', techs);
    data.append('price', price);

    await api.put(`/spots/${spotId}`, data, { headers: { user_id } });

    history.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label
        id="thumbnail"
        style={{ backgroundImage: `url(${preview})` }}
        className={thumbnail ? 'has-thumbnail' : ''}
      >
        <input type="file" onChange={(e) => setThumbnail(e.target.files[0])}/>
        <img src={camera} alt="select img"/>
      </label>

      <label htmlFor="company">EMPRESA *</label>
      <input
        id="company"
        placeholder="Sua empresa incrível"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <label htmlFor="techs">TECNOLOGIAS * <span>(separadas por vírgula)</span></label>
      <input
        id="techs"
        placeholder="Quais tecnologias usam"
        value={techs}
        onChange={(e) => setTechs(e.target.value)}
      />

      <label htmlFor="price">VALOR DA DIÁRIA * <span>(em branco para GRATUITO)</span></label>
      <input
        id="price"
        placeholder="Valor cobrado por dia"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button type="submit" className="btn">Cadastrar</button>
    </form>
  );
}
