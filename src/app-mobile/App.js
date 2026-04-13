import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ProgressBarAndroid, ActivityIndicator } from 'react-native';
import { Smartphone, Download, Disc, RefreshCcw, User, CheckCircle, AlertCircle } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

// API Base URL (adjust to your machine IP for testing on phone)
const API_BASE = 'http://192.168.1.100:8000'; 

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [usbDetected, setUsbDetected] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' });

  // No React Native / Expo, a detecção de USB OTG é feita via Storage Access Framework
  // Em um app real, o usuário precisaria selecionar o pendrive na pasta 'Documents' do Android
  const handleSync = async () => {
    setSyncStatus('syncing');
    setProgress({ current: 0, total: 0, label: 'Buscando pendrive via OTG...' });
    
    // Simulação de Sync Delta no Mobile
    setTimeout(() => {
      setProgress({ current: 5, total: 10, label: 'Baixando novidades...' });
      setTimeout(() => {
        setSyncStatus('success');
      }, 3000);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Smartphone color="#4CAF50" size={28} />
          <Text style={styles.logoText}>SaaS Pendrive</Text>
        </View>
        <TouchableOpacity onPress={() => setIsLogged(!isLogged)} style={styles.loginBtn}>
          <User color="#94a3b8" size={20} />
          <Text style={styles.loginText}>{isLogged ? 'Sair' : 'Login'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.hero}>
          <Text style={styles.title}>Atualização Mobile OTG</Text>
          <Text style={styles.subtitle}>Conecte seu adaptador OTG para sincronizar o pendrive direto pelo celular.</Text>
        </View>

        {/* Status do USB */}
        <View style={[styles.card, usbDetected ? styles.cardActive : null]}>
          <View style={styles.cardHeader}>
            <Disc color={usbDetected ? "#3b82f6" : "#94a3b8"} size={40} />
            <View>
              <Text style={styles.cardTitle}>{usbDetected ? 'Pendrive Conectado' : 'Nenhum USB detectado'}</Text>
              <Text style={styles.cardSub}>{usbDetected ? 'Pronto para atualização de Abril' : 'Plugue seu adaptador OTG'}</Text>
            </View>
          </View>
          {!usbDetected && (
            <TouchableOpacity onPress={() => setUsbDetected(true)} style={styles.scanBtn}>
              <RefreshCcw color="#fff" size={18} />
              <Text style={styles.btnText}>Verificar Conexão</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Painel de Sincronização */}
        {usbDetected && (
          <View style={styles.syncPanel}>
            <Text style={styles.syncTitle}>Status da Sincronização</Text>
            
            {syncStatus === 'idle' && (
              <TouchableOpacity onPress={handleSync} style={styles.syncMainBtn}>
                <Download color="#fff" size={24} />
                <Text style={styles.syncBtnText}>Sincronizar Agora</Text>
              </TouchableOpacity>
            )}

            {syncStatus === 'syncing' && (
              <View style={styles.progressArea}>
                <ActivityIndicator color="#4CAF50" size="large" />
                <Text style={styles.progressLabel}>{progress.label}</Text>
                <View style={styles.progressBarBg}>
                   <View style={[styles.progressBarFill, { width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '10%' }]} />
                </View>
                <Text style={styles.progressSub}>{progress.current} de {progress.total} arquivos</Text>
              </View>
            )}

            {syncStatus === 'success' && (
              <View style={styles.successBox}>
                <CheckCircle color="#4CAF50" size={32} />
                <Text style={styles.successText}>Pendrive Atualizado com Sucesso!</Text>
                <TouchableOpacity onPress={() => {setSyncStatus('idle'); setUsbDetected(false)}} style={styles.finishBtn}>
                  <Text style={styles.finishBtnText}>Finalizar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>V1.0 Mobile © 2026 SaaS Pendrive</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#020617',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 8,
    borderRadius: 8,
  },
  loginText: {
    color: '#94a3b8',
    marginLeft: 5,
  },
  main: {
    padding: 20,
  },
  hero: {
    marginBottom: 30,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a8a',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  cardSub: {
    color: '#94a3b8',
    fontSize: 14,
    marginLeft: 15,
  },
  scanBtn: {
    marginTop: 20,
    backgroundColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
  },
  syncPanel: {
    backgroundColor: '#064e3b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#065f46',
  },
  syncTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  syncMainBtn: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  syncBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  progressArea: {
    alignItems: 'center',
  },
  progressLabel: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#065f46',
    width: '100%',
    borderRadius: 5,
    marginTop: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressSub: {
    color: '#a7f3d0',
    marginTop: 10,
    fontSize: 12,
  },
  successBox: {
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  finishBtn: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  finishBtnText: {
    color: '#064e3b',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  footerText: {
    color: '#334155',
    fontSize: 12,
  },
});
