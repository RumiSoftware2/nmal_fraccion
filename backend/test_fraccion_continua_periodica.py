"""
Pruebas unitarias para fracción continua simple periódica de √p.
"""

from utils.fraccion_continua_simple_periodica import (
    calcular_fraccion_continua_periodica_raiz,
    expandir_fraccion_continua_cuadratica,
    simplificar_radicando,
)


def test_sqrt_2():
    r = calcular_fraccion_continua_periodica_raiz(2, 2)
    assert r['exito']
    assert r['coeficientes']['preperiodo'] == [1]
    assert r['coeficientes']['periodo'] == [2]
    assert r'\overline{2}' in r['fraccion_continua']['latex']


def test_sqrt_6():
    r = calcular_fraccion_continua_periodica_raiz(6, 2)
    assert r['coeficientes']['preperiodo'] == [2]
    assert r['coeficientes']['periodo'] == [2, 4]


def test_sqrt_7():
    r = calcular_fraccion_continua_periodica_raiz(7, 2)
    assert r['coeficientes']['preperiodo'] == [2]
    assert r['coeficientes']['periodo'] == [1, 1, 1, 4]


def test_sqrt_4_racional():
    r = calcular_fraccion_continua_periodica_raiz(4, 2)
    assert r['es_racional']
    assert not r['es_periodico']
    assert r['coeficientes']['preperiodo'] == [2]
    assert r['coeficientes']['periodo'] == []


def test_indice_invalido():
    r = calcular_fraccion_continua_periodica_raiz(7, 3)
    assert not r['exito']
    assert 'índice' in r['error'].lower() or 'indice' in r['error'].lower()


def test_simplificar_radicando():
    assert simplificar_radicando(12) == (2, 3)
    assert simplificar_radicando(7) == (1, 7)


def test_expandir_directo():
    pre, per, _ = expandir_fraccion_continua_cuadratica(7)
    assert pre == [2]
    assert per == [1, 1, 1, 4]


if __name__ == '__main__':
    test_sqrt_2()
    test_sqrt_6()
    test_sqrt_7()
    test_sqrt_4_racional()
    test_indice_invalido()
    test_simplificar_radicando()
    test_expandir_directo()
    print('Todas las pruebas pasaron.')
