import numpy as np

def convertir_fraccion_base(numerador, denominador, base):
    
    num_base = np.base_repr(numerador, base)
    den_base = np.base_repr(denominador, base)

    return num_base, den_base