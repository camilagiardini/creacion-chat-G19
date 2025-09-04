"use client"
import Contact from "../../../components/Contact";
import Button from "../../../components/Button";
import Message from "../../../components/Message";
import Input from "../../../components/Input";

export default function Chats(props) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                width: '400px',
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}>
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#f3f4f6',
                }}>
                    <Contact />
                    <Button llamada={props.llamada} style={{background: '#6366f1', color: '#fff', borderRadius: '8px', padding: '8px'}} />
                    <Button videollamada={props.videollamada} style={{background: '#6366f1', color: '#fff', borderRadius: '8px', padding: '8px'}} />
                </div>
                <div style={{
                    flex: 1,
                    padding: '20px',
                    background: 'url(' + props.fondo + ') center/cover',
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    overflowY: 'auto',
                }}>
                    <Message />
                </div>
                <div style={{
                    padding: '16px',
                    borderTop: '1px solid #e5e7eb',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <Button archivosAdjuntos={props.archivosAdjuntos} style={{background: '#e5e7eb', borderRadius: '8px', padding: '8px'}} />
                    <Input style={{flex: 1, borderRadius: '10px', border: '1px solid #e5e7eb', padding: '10px'}} />
                    <Button enviar={props.enviar} style={{background: '#6366f1', color: '#fff', borderRadius: '10px', padding: '10px 16px', fontWeight: 'bold'}} />
                </div>
            </div>
        </div>
    );
}