import ply.lex as lex

tokens = (
        'LANGLE',       # <
        'LANGLESLASH',  # </
        'RANGLE',       # >
        'SLASHRANGLE',  # />
        'EQUAL',        # =
        'STRING',       # "144"
        'WORD',         # 'Welcome' in "Welcome to my webpage."
)

t_ignore                = ' \t\v\r' # shortcut for whitespace

def t_LANGLESLASH(t):
        r'</'
        return t

def t_LANGLE(t):
        r'<'
        return t

def t_SLASHRANGLE(t):
        r'/>'
        return t

def t_RANGLE(t):
        r'>'
        return t

def t_EQUAL(t):
        r'='
        return t

def t_STRING(t):
        r'"[^"]*"'
        t.value = t.value[1:-1] # drop "surrounding quotes"
        return t

def t_WORD(t):
        r'[^ <>\n]+'
        return t
def t_error(t):
        pass

text = """Hello <b>World</b>"""
htmllex = lex.lex()
htmllex.input(text)
while True:
        tok = htmllex.token()
        if not tok: break
        print tok
import ply.lex as lex

tokens = (
        'LANGLE',       # <
        'LANGLESLASH',  # </
        'RANGLE',       # >
        'SLASHRANGLE',  # />
        'EQUAL',        # =
        'STRING',       # "144"
        'WORD',         # 'Welcome' in "Welcome to my webpage."
)

t_ignore                = ' \t\v\r' # shortcut for whitespace

def t_LANGLESLASH(t):
        r'</'
        return t

def t_LANGLE(t):
        r'<'
        return t

def t_SLASHRANGLE(t):
        r'/>'
        return t

def t_RANGLE(t):
        r'>'
        return t

def t_EQUAL(t):
        r'='
        return t

def t_STRING(t):
        r'"[^"]*"'
        t.value = t.value[1:-1] # drop "surrounding quotes"
        return t

def t_WORD(t):
        r'[^ <>\n]+'
        return t
def t_error(t):
        pass

text = """Hello <b>World</b>"""
htmllex = lex.lex()
htmllex.input(text)
while True:
        tok = htmllex.token()
        if not tok: break
        print tok
