"""
Script de prueba para el backend de Math Tutor
Demuestra cómo hacer requests al API
"""
import requests
import json
from time import sleep

# URL del servidor (cambiar si está en otro host/puerto)
BASE_URL = "http://localhost:8000"

def test_convertidor():
    """Prueba el endpoint de convertir periódicos"""
    
    print("=" * 60)
    print("PRUEBA DEL BACKEND - MATH TUTOR")
    print("=" * 60)
    print()
    
    # Ejemplos de prueba
    ejemplos = [
        {
            "nombre": "Ejemplo 1: 0.1̄6̄ en base 7",
            "data": {
                "entero": "0",
                "no_periodo": "1",
                "periodo": "6",
                "base": 7
            }
        },
        {
            "nombre": "Ejemplo 2: 0.3̄ en base 10",
            "data": {
                "entero": "0",
                "no_periodo": "",
                "periodo": "3",
                "base": 10
            }
        },
        {
            "nombre": "Ejemplo 3: 1.2̄1̄ en base 8",
            "data": {
                "entero": "1",
                "no_periodo": "2",
                "periodo": "1",
                "base": 8
            }
        }
    ]
    
    for ejemplo in ejemplos:
        print(f"\n{ejemplo['nombre']}")
        print("-" * 60)
        
        try:
            # Hacer request al servidor
            response = requests.post(
                f"{BASE_URL}/convertir-periodico",
                json=ejemplo['data'],
                timeout=5
            )
            
            if response.status_code == 200:
                resultado = response.json()
                
                # Mostrar entrada
                print(f"Entrada:")
                print(f"  Entero: {resultado['input']['entero']}")
                print(f"  No período: {resultado['input']['no_periodo']}")
                print(f"  Período: {resultado['input']['periodo']}")
                print(f"  Base: {resultado['input']['base']}")
                print()
                
                # Mostrar cada paso
                print("Pasos del cálculo:")
                for paso in resultado['pasos']:
                    print(f"\n  PASO {paso['paso']}: {paso['descripcion']}")
                    print(f"    {paso['resultado']}")
                    if paso['valor'] is not None:
                        print(f"    Valor: {paso['valor']}")
                
                # Mostrar resultado final
                print()
                print("RESULTADO FINAL:")
                print(f"  Fracción en base 10: {resultado['fraccion_decimal']}")
                print(f"  Fracción en base {resultado['input']['base']}: {resultado['fraccion_base_original']}")
                
            else:
                print(f"❌ Error: {response.status_code}")
                print(response.json())
                
        except requests.exceptions.ConnectionError:
            print("❌ No se puede conectar al servidor.")
            print("   Asegúrate de ejecutar: python app.py")
            return False
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return False
    
    print("\n" + "=" * 60)
    print("✅ Pruebas completadas correctamente")
    print("=" * 60)
    return True

def test_server_info():
    """Prueba el endpoint raíz"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            info = response.json()
            print(f"Servidor: {info['mensaje']}")
            print(f"Versión: {info['version']}")
            print(f"Descripción: {info['descripcion']}")
            return True
    except requests.exceptions.ConnectionError:
        print("No se puede conectar al servidor. ¿Está ejecutándose?")
        print("Ejecuta: python app.py")
        return False

if __name__ == "__main__":
    print("\n🔍 Verificando servidor...\n")
    
    if test_server_info():
        print("\n✅ Servidor activo. Iniciando pruebas...\n")
        sleep(1)
        test_convertidor()
    else:
        print("\n⚠️  El servidor no está disponible.")
        print("Para iniciar el servidor, ejecuta:")
        print("  python app.py")
