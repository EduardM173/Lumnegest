import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          {/* <Image source={require("./assets/logo.png")} style={styles.logo} /> */}
        </View>

        {/* Imagen principal */}
        <Image
          source={require("./assets/portada.png")}
          style={styles.mainImage}
        />

        {/* Sección de LUMENGEST */}
        <View style={styles.infoContainer}>
          <Text style={styles.lumengestText}>LUMENGEST</Text>
          <Text style={styles.descriptionText}>
            En LumenGest, entendemos la importancia de honrar la memoria de sus seres queridos.{"\n\n"}
            Nuestro compromiso es ofrecer un servicio cálido, respetuoso y profesional, brindando apoyo en los momentos más difíciles.{"\n\n"}
            Nos esforzamos por ser un pilar de confianza y empatía para las familias que confían en nosotros.
          </Text>

          <View style={styles.ctaContainer}>
            <Image
              source={require("./assets/icono.png")}
              style={styles.iconoGrande}
            />
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>Cotizar ahora</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sección Paquetes */}
        <Text style={styles.sectionTitle}>Paquetes</Text>
        <View style={styles.paquetesBackground}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carruselContainer}
          >
            {/* Paquete Esencial */}
            <View style={styles.paqueteCard}>
              <Text style={styles.paqueteTitulo}>Paquete Esencial</Text>
              <View style={styles.imagenPlaceholder}>
                <Text style={styles.imagenTexto}>Imagen</Text>
              </View>
              <View style={styles.paqueteDetalles}>
                <Text style={styles.paqueteTexto}>- Ataúd estándar</Text>
                <Text style={styles.paqueteTexto}>- Traslado local</Text>
                <Text style={styles.paqueteTexto}>- Asesoría básica</Text>
                <Text style={styles.paqueteDescripcion}>
                  Incluye servicios esenciales.
                </Text>
              </View>
              <View style={styles.precioContainer}>
                <Text style={styles.precio}>Precio: $1,200</Text>
                <TouchableOpacity>
                  <Text style={styles.verPaquete}>Ver paquete</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Paquete Intermedio */}
            <View style={styles.paqueteCard}>
              <Text style={styles.paqueteTitulo}>Paquete Intermedio</Text>
              <View style={styles.imagenPlaceholder}>
                <Text style={styles.imagenTexto}>Imagen</Text>
              </View>
              <View style={styles.paqueteDetalles}>
                <Text style={styles.paqueteTexto}>- Ataúd de lujo</Text>
                <Text style={styles.paqueteTexto}>- Traslado nacional</Text>
                <Text style={styles.paqueteTexto}>- Ceremonia personalizada</Text>
                <Text style={styles.paqueteTexto}>- Asesoría completa</Text>
                <Text style={styles.paqueteDescripcion}>
                  Un servicio completo con detalles personalizados.
                </Text>
              </View>
              <View style={styles.precioContainer}>
                <Text style={styles.precio}>Precio: $3,500</Text>
                <TouchableOpacity>
                  <Text style={styles.verPaquete}>Ver paquete</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Paquete Premium */}
            <View style={styles.paqueteCard}>
              <Text style={styles.paqueteTitulo}>Paquete Premium</Text>
              <View style={styles.imagenPlaceholder}>
                <Text style={styles.imagenTexto}>Imagen</Text>
              </View>
              <View style={styles.paqueteDetalles}>
                <Text style={styles.paqueteTexto}>- Ataúd premium</Text>
                <Text style={styles.paqueteTexto}>- Traslado regional</Text>
                <Text style={styles.paqueteTexto}>- Servicio de catering</Text>
                <Text style={styles.paqueteTexto}>- Apoyo psicológico</Text>
                <Text style={styles.paqueteDescripcion}>
                  Pensado para brindar apoyo integral a toda la familia.
                </Text>
              </View>
              <View style={styles.precioContainer}>
                <Text style={styles.precio}>Precio: $2,800</Text>
                <TouchableOpacity>
                  <Text style={styles.verPaquete}>Ver paquete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Sección Acerca de Nosotros + Testimonios */}
        <View style={styles.aboutAndTestimonialsContainer}>
          {/* Acerca de Nosotros */}
          <View style={styles.aboutContainer}>
            <Text style={styles.sectionTitleAbout}>Acerca de nosotros</Text>
            <Text style={styles.aboutText}>
              Fundada en 1995, LumenGest ha crecido hasta convertirse en un referente regional, gracias a la confianza de más de 10,000 familias atendidas a lo largo de los años.
            </Text>
            <Text style={styles.sectionSubtitle}>Misión</Text>
            <Text style={styles.aboutText}>
              Brindar servicios funerarios humanizados y accesibles, cuidando cada detalle para apoyar a las familias en momentos difíciles.
            </Text>
            <Text style={styles.sectionSubtitle}>Visión</Text>
            <Text style={styles.aboutText}>
              Ser la empresa líder en innovación y calidad de servicios funerarios, destacándonos por nuestro compromiso con la excelencia y la empatía.
            </Text>
          </View>

          {/* Testimonios */}
          <View style={styles.testimonialsContainer}>
            <Text style={styles.sectionTitleAbout}>Testimonios</Text>

            {/* Testimonio 1 */}
            <View style={styles.testimonioCard}>
              <View style={styles.testimonioTop}>
                <View style={styles.fotoPlaceholder}>
                  <Text style={styles.fotoText}>Foto</Text>
                </View>
                <View style={styles.testimonioInfo}>
                  <Text style={styles.testimonioMensaje}>
                    El servicio fue excepcional
                  </Text>
                  <Text style={styles.testimonioNombre}>María López</Text>
                </View>
              </View>
              <Text style={styles.testimonioFecha}>15 de marzo de 2023</Text>
            </View>

            {/* Testimonio 2 */}
            <View style={styles.testimonioCard}>
              <View style={styles.testimonioTop}>
                <View style={styles.fotoPlaceholder}>
                  <Text style={styles.fotoText}>Foto</Text>
                </View>
                <View style={styles.testimonioInfo}>
                  <Text style={styles.testimonioMensaje}>
                    LumenGest nos ofreció un trato humano y profesional.
                  </Text>
                  <Text style={styles.testimonioNombre}>Juan Pérez</Text>
                </View>
              </View>
              <Text style={styles.testimonioFecha}>22 de abril de 2023</Text>
            </View>

          </View>
        </View>
      </ScrollView>

      {/* Barra de navegación inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("./assets/home-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Login")}
        >
          <Image
            source={require("./assets/user-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Cart")}
        >
          <Image
            source={require("./assets/cart-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Carrito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Buscar")}
        >
          <Image
            source={require("./assets/search-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//Estilos

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F2EFEA",
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "#2E3B4E",
    padding: 10,
    borderRadius: 10,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: "contain",
  },
  mainImage: {
    width: "100%",
    height: 450,
    resizeMode: "cover",
    marginBottom: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  lumengestText: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "serif",
    textAlign: "center",
    marginBottom: 10,
    color: "#B59F6B",
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#3A4A58",
    lineHeight: 24,
  },
  ctaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  iconoGrande: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },
  ctaButton: {
    backgroundColor: "#6C4F4B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  ctaText: {
    color: "#F2EFEA",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    color: "#6C4F4B",
    textAlign: "center",
  },
  paquetesBackground: {
    backgroundColor: "#6C4F4B",
    paddingVertical: 20,
    marginVertical: 20,
    borderRadius: 12,
  },
  carruselContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  paqueteCard: {
    backgroundColor: "#F2EFEA",
    borderRadius: 12,
    width: 250,
    marginRight: 15,
    padding: 15,
  },
  paqueteTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6C4F4B",
    textAlign: "center",
  },
  imagenPlaceholder: {
    backgroundColor: "#CED2D4",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  imagenTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paqueteDetalles: {
    marginBottom: 10,
  },
  paqueteTexto: {
    fontSize: 14,
    color: "#3A4A58",
    marginBottom: 5,
  },
  paqueteDescripcion: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#3A4A58",
  },
  precioContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  precio: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3A4A58",
    marginBottom: 5,
  },
  verPaquete: {
    fontSize: 14,
    color: "#6C4F4B",
    textDecorationLine: "underline",
  },
  aboutAndTestimonialsContainer: {
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  aboutContainer: {
    marginBottom: 30,
  },
  sectionTitleAbout: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6C4F4B",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#3A4A58",
    marginBottom: 10,
    lineHeight: 24,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#6C4F4B",
    textAlign: "center",
  },
  testimonialsContainer: {
    marginBottom: 20,
  },
  testimonioCard: {
    backgroundColor: "#F2EFEA",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: "center",
  },
  testimonioTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
    justifyContent: "center",
  },
  fotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#CED2D4",
    justifyContent: "center",
    alignItems: "center",
  },
  fotoText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  testimonioInfo: {
    flex: 1,
    alignItems: "center",
  },
  testimonioMensaje: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3A4A58",
    marginBottom: 2,
    textAlign: "center",
  },
  testimonioNombre: {
    fontSize: 14,
    color: "#3A4A58",
    textAlign: "center",
  },
  testimonioFecha: {
    fontSize: 12,
    color: "#3A4A58",
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#2E3B4E",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 3,
    resizeMode: "contain",
    tintColor: "#ffffff",
  },
  navLabel: {
    fontSize: 12,
    color: "#ffffff",
  },
});