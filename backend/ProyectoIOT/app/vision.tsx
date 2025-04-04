// app/vision.tsx
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Entypo } from '@expo/vector-icons';

export default function VisionScreen() {
    const router = useRouter();
    const API_BASE = 'http://192.168.8.6:8082/api'; // Ajusta tu URL según sea necesario(IPCONFIG)
    const [vision, setVision] = useState('');

    // useEffect para cargar los datos de la visión desde el backend
    useEffect(() => {
        const fetchVision = async () => {
            try {
                const response = await axios.get(`${API_BASE}/empresa/visiones`);
                // Suponiendo que los valores están ordenados por fecha de creación en la base de datos
                const data = response.data as { contenido: string }[];
                const lastVision = data[data.length - 1]; // Tomamos el último elemento
                setVision(lastVision?.contenido || 'No hay visión definida.');
            } catch (error) {
                console.error("Error fetching vision:", error);
                setVision('Error al obtener visión.');
            }
        };
        fetchVision();
    }, []);

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.cardContainer}>
                    {/* Barra Superior */}
                    <View style={styles.topBar}>
                        <Text style={styles.logo}>Segurix</Text>
                        <View style={styles.nav}>
                            <Text style={styles.navText} onPress={() => router.push('/CatalogoProductosScreen')}>Ver productos</Text>
                        </View>
                    </View>

                    {/* Sección Hero (Imagen) */}
                    <View style={styles.heroSection}>
                        <Image
                            source={require('../assets/images/puertaIOT-vision.jpg')} // Ajusta la ruta o usa otra imagen
                            style={styles.heroImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Contenido principal: Visión */}
                    <View style={styles.mainContent}>
                        <Text style={styles.title}>Última Visión</Text>
                        <Text style={styles.parrafo}>{vision}</Text>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <View style={styles.footerLeft}>
                            <Text style={styles.footerText}>Términos y condiciones</Text>
                            <Text style={styles.footerText}>Privacidad</Text>
                        </View>
                        <View style={styles.footerRight}>
                            <Entypo name="instagram-with-circle" size={24} color="#1E1E1E" style={styles.icon} />
                            <Entypo name="facebook-with-circle" size={24} color="#1E1E1E" style={styles.icon} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#CFE2FF',
    },
    cardContainer: {
        margin: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 10,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E1E1E',
    },
    nav: {
        flexDirection: 'row',
    },
    navText: {
        fontSize: 16,
        color: '#1E1E1E',
        marginLeft: 20,
    },
    heroSection: {
        marginTop: 10,
        alignItems: 'center',
    },
    heroImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    mainContent: {
        marginTop: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E1E1E',
        marginBottom: 10,
        textAlign: 'center',
    },
    parrafo: {
        fontSize: 16,
        color: '#2C2C2C',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 10,
    },
    footerLeft: {
        flexDirection: 'row',
    },
    footerRight: {
        flexDirection: 'row',
    },
    footerText: {
        fontSize: 14,
        color: '#1E1E1E',
        marginRight: 20,
    },
    icon: {
        marginRight: 15,
    },
});
